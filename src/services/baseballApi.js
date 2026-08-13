import axios from 'axios'
import { baseballGames, stadiumInfo, teamProfiles } from '@/data/baseball/baseballData.js'
import { calculateCancelRisk } from '@/utils/baseball/weatherRisk.js'

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast'

function removeTags(value = '') {
  return value.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim()
}

function createDate(year, dayText) {
  const match = dayText.match(/(\d{2})\.(\d{2})/)
  if (!match) return ''
  return `${year}-${match[1]}-${match[2]}`
}

function getTeams(playText) {
  const withoutScore = playText.replace(/<em>[\s\S]*?<\/em>/, '')
  const teams = [...withoutScore.matchAll(/<span[^>]*>(.*?)<\/span>/g)]
  return teams.map((match) => removeTags(match[1]))
}

function getTeamProfile(shortName) {
  return teamProfiles[shortName] || {
    name: shortName,
    shortName,
    wins: 0,
    losses: 0,
    rank: 0,
    streak: '-',
  }
}

function getDefaultWeather(stadiumName) {
  const sample = baseballGames.find((game) => game.stadium === stadiumName)
  return sample?.weather || { status: '예보 대기', temp: 0, humidity: 0, wind: 0, rain: 0, rainChance: 0 }
}

function makeExpectedScore(away, home) {
  if (!away.rank || !home.rank) return { away: 4, home: 4 }
  if (away.rank < home.rank) return { away: 5, home: 4 }
  if (away.rank > home.rank) return { away: 3, home: 5 }
  return { away: 4, home: 4 }
}

// KBO가 제공하는 표 형태 JSON을 BALLCAST 경기 객체로 바꾼다.
export function parseKboSchedule(rows, year) {
  const games = []
  let gameDate = ''

  rows.forEach((item, index) => {
    const cells = item.row || []
    const dayCell = cells.find((cell) => cell.Class === 'day')
    const timeCell = cells.find((cell) => cell.Class === 'time')
    const playCell = cells.find((cell) => cell.Class === 'play')

    if (dayCell) gameDate = createDate(year, dayCell.Text)
    if (!gameDate || !timeCell || !playCell) return

    const [awayName, homeName] = getTeams(playCell.Text)
    const cellTexts = cells.map((cell) => removeTags(cell.Text))
    const stadiumKey = Object.keys(stadiumInfo).find((key) => cellTexts.includes(key))
    const stadium = stadiumInfo[stadiumKey]

    if (!awayName || !homeName || !stadium) return

    const away = { ...getTeamProfile(awayName) }
    const home = { ...getTeamProfile(homeName) }
    const weather = { ...getDefaultWeather(stadium.name), rainChance: 0 }

    games.push({
      id: `${gameDate}-${awayName}-${homeName}-${index}`,
      date: gameDate,
      time: removeTags(timeCell.Text),
      stadium: stadium.name,
      city: stadium.city,
      latitude: stadium.latitude,
      longitude: stadium.longitude,
      isDome: stadium.isDome,
      away,
      home,
      expectedScore: makeExpectedScore(away, home),
      weather,
      cancelRisk: calculateCancelRisk(weather, stadium.isDome),
      point: `${awayName}와 ${homeName}의 공식 KBO 일정입니다.`,
      note: cellTexts.at(-1) === '-' ? '' : cellTexts.at(-1),
    })
  })

  return games
}

// 선택한 달의 KBO 공식 일정을 요청한다.
export async function getKboSchedule(date) {
  const year = date.slice(0, 4)
  const month = date.slice(5, 7)
  const body = new URLSearchParams({
    leId: '1',
    srIdList: '0,9,6',
    seasonId: year,
    gameMonth: month,
    teamId: '',
  })
  const response = await axios.post('/api/kbo-schedule', body)
  return parseKboSchedule(response.data.rows || [], year)
}

// 경기 시작 시각과 가장 가까운 3시간 예보를 선택한다.
export async function addGameForecast(game) {
  const response = await axios.get(FORECAST_URL, {
    params: {
      lat: game.latitude,
      lon: game.longitude,
      appid: API_KEY,
      units: 'metric',
      lang: 'kr',
    },
  })

  const targetTime = new Date(`${game.date}T${game.time}:00+09:00`).getTime() / 1000
  const forecasts = response.data.list || []
  const closest = forecasts.reduce((selected, item) => {
    if (!selected) return item
    return Math.abs(item.dt - targetTime) < Math.abs(selected.dt - targetTime) ? item : selected
  }, null)

  if (!closest) return game

  game.weather = {
    status: closest.weather[0].description,
    temp: Math.round(closest.main.temp),
    humidity: closest.main.humidity,
    wind: closest.wind.speed,
    rain: closest.rain?.['3h'] || 0,
    rainChance: Math.round((closest.pop || 0) * 100),
    forecastTime: closest.dt_txt.slice(11, 16),
  }
  game.cancelRisk = calculateCancelRisk(game.weather, game.isDome)
  return game
}
