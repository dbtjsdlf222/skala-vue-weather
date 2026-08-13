import { ref } from 'vue'
import { defineStore } from 'pinia'
import { baseballGames } from '@/data/baseball/baseballData.js'
import { addGameForecast, getKboSchedule } from '@/services/baseballApi.js'
import { calculateCancelRisk } from '@/utils/baseball/weatherRisk.js'

const monthCache = new Map()

export function getDateKey(dayOffset = 0) {
  const date = new Date()
  date.setDate(date.getDate() + dayOffset)
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

export function getWeekendDate() {
  const date = new Date()
  const daysUntilSaturday = (6 - date.getDay() + 7) % 7
  date.setDate(date.getDate() + daysUntilSaturday)
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

function getSampleGames(date) {
  return baseballGames
    .filter((game) => game.scheduleDay === '오늘')
    .map((game) => ({
      ...game,
      date,
      away: { ...game.away },
      home: { ...game.home },
      weather: { ...game.weather, rainChance: 0 },
      expectedScore: { ...game.expectedScore },
      cancelRisk: calculateCancelRisk(game.weather, game.isDome),
    }))
}

export const useBaseballStore = defineStore('baseball', () => {
  const games = ref([])
  const selectedDate = ref(getDateKey())
  const isLoading = ref(false)
  const lastUpdated = ref('일정 연결 전')
  const dataSource = ref('KBO 일정 확인 중')
  const errorMessage = ref('')

  async function loadGames(date = getDateKey()) {
    selectedDate.value = date
    isLoading.value = true
    errorMessage.value = ''

    try {
      const month = date.slice(0, 7)
      if (!monthCache.has(month)) {
        monthCache.set(month, await getKboSchedule(date))
      }

      games.value = monthCache.get(month).filter((game) => game.date === date)
      dataSource.value = 'KBO 공식 일정'

      const results = await Promise.allSettled(games.value.map((game) => addGameForecast(game)))
      if (results.some((result) => result.status === 'rejected')) {
        errorMessage.value = '일부 구장은 기본 날씨를 표시합니다.'
      }
    } catch (error) {
      console.error(error)
      games.value = getSampleGames(date)
      dataSource.value = '샘플 일정'
      errorMessage.value = '공식 일정을 불러오지 못해 샘플 일정을 표시합니다.'
    } finally {
      lastUpdated.value = new Date().toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
      })
      isLoading.value = false
    }
  }

  return { games, selectedDate, isLoading, lastUpdated, dataSource, errorMessage, loadGames }
})
