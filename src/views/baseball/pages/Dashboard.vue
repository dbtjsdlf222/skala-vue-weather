<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import axios from 'axios'
import {
  ElInput,
  ElMessage,
  ElOption,
  ElProgress,
  ElSelect,
  ElSwitch,
} from 'element-plus'
import SummaryCard from '@/components/baseball/SummaryCard.vue'
import GameSchedule from '@/components/baseball/GameSchedule.vue'
import { baseballGames, riskOptions } from '@/data/baseball/baseballData.js'
import { calculateCancelRisk, getRiskInfo, getRiskReasons } from '@/utils/baseball/weatherRisk.js'

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather'

// 원본 샘플 데이터를 복사하고 취소 확률을 계산한다.
const games = ref(
  baseballGames.map((game) => ({
    ...game,
    away: { ...game.away },
    home: { ...game.home },
    weather: { ...game.weather },
    expectedScore: { ...game.expectedScore },
    cancelRisk: calculateCancelRisk(game.weather, game.isDome),
  })),
)

const selectedId = ref(games.value[0].id)
const riskFilter = ref('all')
const search = ref('')
const isLoading = ref(false)
const lastUpdated = ref('날씨 연결 전')
const notificationOn = ref(localStorage.getItem('baseballAlert') === 'true')
const favoriteIds = ref(JSON.parse(localStorage.getItem('favoriteGames') || '[]'))
let weatherTimer

// 검색어와 위험 단계가 모두 일치하는 경기만 보여준다.
const filteredGames = computed(() => {
  return games.value.filter((game) => {
    const keyword = search.value.trim()
    const sameKeyword =
      !keyword ||
      game.away.name.includes(keyword) ||
      game.home.name.includes(keyword) ||
      game.stadium.includes(keyword)

    const level = getRiskInfo(game.cancelRisk, game.isDome).level
    const sameRisk =
      riskFilter.value === 'all' ||
      (riskFilter.value === 'safe' && (level === 'safe' || level === 'dome')) ||
      riskFilter.value === level

    return sameKeyword && sameRisk
  })
})

const selectedGame = computed(() => {
  return games.value.find((game) => game.id === selectedId.value) || games.value[0]
})

const summary = computed(() => {
  const outdoorGames = games.value.filter((game) => !game.isDome)
  const average = Math.round(
    outdoorGames.reduce((total, game) => total + game.cancelRisk, 0) / outdoorGames.length,
  )

  return {
    total: games.value.length,
    danger: games.value.filter((game) => game.cancelRisk >= 60).length,
    warning: games.value.filter((game) => game.cancelRisk >= 30 && game.cancelRisk < 60).length,
    average,
  }
})

const selectedRisk = computed(() => {
  return getRiskInfo(selectedGame.value.cancelRisk, selectedGame.value.isDome)
})

const riskReasons = computed(() => {
  return getRiskReasons(selectedGame.value.weather, selectedGame.value.isDome)
})

const expectedWinner = computed(() => {
  const game = selectedGame.value
  if (game.expectedScore.away === game.expectedScore.home) return '동점 예상'
  return game.expectedScore.away > game.expectedScore.home ? `${game.away.shortName} 우세` : `${game.home.shortName} 우세`
})

const scoreGap = computed(() => {
  return Math.abs(selectedGame.value.expectedScore.away - selectedGame.value.expectedScore.home)
})

const preparationItems = computed(() => {
  if (selectedGame.value.isDome) return ['가벼운 겉옷', '응원 도구', '대중교통 시간 확인']
  if (selectedGame.value.cancelRisk >= 60) return ['구단 취소 공지 확인', '우비', '방수 가방']
  if (selectedGame.value.cancelRisk >= 30) return ['접이식 우산', '방수팩', '얇은 겉옷']
  return ['응원 도구', '물', '선크림']
})

const funMessage = computed(() => {
  if (selectedGame.value.isDome) return '오늘은 방수포보다 응원봉이 먼저 출근합니다.'
  if (selectedGame.value.cancelRisk >= 60) return '선발 투수보다 구장 방수포의 등판 가능성이 높습니다.'
  if (selectedGame.value.cancelRisk >= 30) return '플레이볼과 빗방울의 눈치 싸움이 예상됩니다.'
  return '날씨는 준비 완료, 이제 타선만 터지면 됩니다.'
})

const winRate = (team) => {
  return ((team.wins / (team.wins + team.losses)) * 100).toFixed(1)
}

const selectGame = (id) => {
  selectedId.value = id
}

const toggleFavorite = () => {
  const id = selectedGame.value.id
  if (favoriteIds.value.includes(id)) {
    favoriteIds.value = favoriteIds.value.filter((item) => item !== id)
    ElMessage.info('관심 경기에서 해제했습니다.')
    return
  }

  favoriteIds.value.push(id)
  ElMessage.success('관심 경기에 등록했습니다.')
}

const changeNotification = (value) => {
  ElMessage.success(value ? '경기 변동 알림을 켰습니다.' : '경기 변동 알림을 껐습니다.')
}

// 한 경기장에 필요한 날씨를 요청한다.
const getWeather = async (game) => {
  const response = await axios.get(WEATHER_URL, {
    params: {
      lat: game.latitude,
      lon: game.longitude,
      appid: API_KEY,
      units: 'metric',
      lang: 'kr',
    },
  })

  game.weather = {
    status: response.data.weather[0].description,
    temp: Math.round(response.data.main.temp),
    humidity: response.data.main.humidity,
    wind: response.data.wind.speed,
    rain: response.data.rain?.['1h'] || 0,
  }
  game.cancelRisk = calculateCancelRisk(game.weather, game.isDome)
}

// 마지막으로 날씨를 가져온 시간을 저장한다.
const updateTime = () => {
  lastUpdated.value = new Date().toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

// 화면이 처음 열리면 모든 구장의 현재 날씨를 한 번에 가져온다.
const loadAllWeather = async () => {
  isLoading.value = true
  lastUpdated.value = 'API 요청 중'

  try {
    await Promise.all(games.value.map((game) => getWeather(game)))
    updateTime()
  } catch (error) {
    console.error(error)
    lastUpdated.value = '일부 샘플 데이터 사용 중'
  } finally {
    isLoading.value = false
  }
}

// 대시보드가 나타나면 즉시 호출하고 이후 5분마다 자동 갱신한다.
onMounted(() => {
  loadAllWeather()
  weatherTimer = setInterval(loadAllWeather, 5 * 60 * 1000)
})

// 다른 페이지로 이동하면 자동 갱신 타이머를 종료한다.
onUnmounted(() => {
  clearInterval(weatherTimer)
})

// 관심 경기와 알림 설정을 브라우저에 보관한다.
watch(favoriteIds, (value) => localStorage.setItem('favoriteGames', JSON.stringify(value)), {
  deep: true,
})
watch(notificationOn, (value) => localStorage.setItem('baseballAlert', value))
</script>

<template>
  <div class="dashboard-page">
    <main class="ops-main">
      <section class="page-intro">
        <div>
          <span class="eyebrow">TODAY'S GAME OPERATIONS</span>
          <h1>날씨 기반 야구 경기 운영 대시보드</h1>
          <p>강수량, 습도, 풍속과 구장 유형을 기준으로 오늘 경기의 취소 가능성을 확인합니다.</p>
        </div>
        <div class="data-status">
          <span class="status-dot"></span>
          <div>
            <strong>{{ isLoading ? '실시간 날씨 갱신 중' : '실시간 자동 갱신' }}</strong>
            <small>5분 주기 · 최근 갱신: {{ lastUpdated }}</small>
          </div>
        </div>
      </section>

      <div class="sample-notice">
        경기 일정, 팀 기록과 예상 점수는 실습용 샘플 데이터입니다. 구장 날씨는 화면 진입 즉시 불러오며 5분마다 자동 갱신됩니다.
      </div>

      <section class="summary-grid">
        <SummaryCard label="오늘 예정 경기" description="18:30 일괄 경기">{{ summary.total }}경기</SummaryCard>
        <SummaryCard label="취소 위험 경기" description="취소 가능성 60% 이상" tone="red">{{ summary.danger }}경기</SummaryCard>
        <SummaryCard label="진행 주의 경기" description="현장 공지 확인 권장" tone="orange">{{ summary.warning }}경기</SummaryCard>
        <SummaryCard label="야외 평균 위험도" description="돔구장 제외 평균" tone="green">{{ summary.average }}%</SummaryCard>
      </section>

      <section id="schedule" class="panel schedule-panel">
        <div class="panel-head">
          <div>
            <span class="panel-label">GAME SCHEDULE</span>
            <h2>오늘의 경기 일정</h2>
          </div>
          <div class="filters">
            <el-input v-model="search" placeholder="팀 또는 구장 검색" clearable />
            <el-select v-model="riskFilter" aria-label="운영 전망 필터">
              <el-option
                v-for="option in riskOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
          </div>
        </div>

        <GameSchedule :games="filteredGames" :selected-id="selectedId" @select="selectGame" />
      </section>

      <section id="analysis" class="analysis-grid">
        <article class="panel risk-panel">
          <div class="panel-head compact">
            <div>
              <span class="panel-label">CANCELLATION RISK</span>
              <h2>선택 경기 취소 전망</h2>
            </div>
            <button class="favorite-btn" @click="toggleFavorite">
              {{ favoriteIds.includes(selectedGame.id) ? '관심 경기 해제' : '관심 경기 등록' }}
            </button>
          </div>

          <div class="risk-main">
            <el-progress
              type="dashboard"
              :percentage="selectedGame.cancelRisk"
              :width="165"
              :stroke-width="12"
              :color="selectedGame.cancelRisk >= 60 ? '#dc4b55' : selectedGame.cancelRisk >= 30 ? '#e9902a' : '#24936f'"
            />
            <div class="risk-copy">
              <span class="risk-state" :class="selectedRisk.level">{{ selectedRisk.label }}</span>
              <h3>{{ selectedGame.away.name }} vs {{ selectedGame.home.name }}</h3>
              <p>{{ selectedGame.stadium }} · {{ selectedGame.time }} 경기</p>
              <ul>
                <li v-for="reason in riskReasons" :key="reason">{{ reason }}</li>
              </ul>
            </div>
          </div>

          <div class="weather-metrics">
            <div><span>날씨</span><strong>{{ selectedGame.weather.status }}</strong></div>
            <div><span>기온</span><strong>{{ selectedGame.weather.temp }}도</strong></div>
            <div><span>습도</span><strong>{{ selectedGame.weather.humidity }}%</strong></div>
            <div><span>풍속</span><strong>{{ selectedGame.weather.wind }}m/s</strong></div>
          </div>

        </article>

        <article class="panel score-panel">
          <div class="panel-head compact">
            <div>
              <span class="panel-label">GAME PREVIEW</span>
              <h2>예상 스코어</h2>
            </div>
            <span class="simple-badge">단순 기록 기반</span>
          </div>

          <div class="scoreboard">
            <div class="team-score">
              <span>AWAY</span>
              <b>{{ selectedGame.away.shortName }}</b>
              <strong>{{ selectedGame.expectedScore.away }}</strong>
            </div>
            <div class="score-center">
              <span>예상</span>
              <b>:</b>
              <small>{{ expectedWinner }}</small>
            </div>
            <div class="team-score home">
              <span>HOME</span>
              <b>{{ selectedGame.home.shortName }}</b>
              <strong>{{ selectedGame.expectedScore.home }}</strong>
            </div>
          </div>

          <div class="score-summary">
            <span>예상 점수 차</span>
            <strong>{{ scoreGap }}점</strong>
          </div>
          <p class="watch-point">{{ selectedGame.point }}</p>
        </article>
      </section>

      <section id="records" class="bottom-grid">
        <article class="panel records-panel">
          <div class="panel-head compact">
            <div>
              <span class="panel-label">TEAM RECORDS</span>
              <h2>양 팀 기록 비교</h2>
            </div>
          </div>

          <div class="record-table">
            <div class="record-head"><span>{{ selectedGame.away.shortName }}</span><b>시즌 기록</b><span>{{ selectedGame.home.shortName }}</span></div>
            <div><strong>{{ selectedGame.away.rank }}위</strong><span>순위</span><strong>{{ selectedGame.home.rank }}위</strong></div>
            <div><strong>{{ selectedGame.away.wins }}승 {{ selectedGame.away.losses }}패</strong><span>승패</span><strong>{{ selectedGame.home.wins }}승 {{ selectedGame.home.losses }}패</strong></div>
            <div><strong>{{ winRate(selectedGame.away) }}%</strong><span>승률</span><strong>{{ winRate(selectedGame.home) }}%</strong></div>
            <div><strong>{{ selectedGame.away.streak }}</strong><span>최근 흐름</span><strong>{{ selectedGame.home.streak }}</strong></div>
          </div>
        </article>

        <article class="panel practical-panel">
          <div class="panel-head compact">
            <div>
              <span class="panel-label">BALLPARK GUIDE</span>
              <h2>직관 준비 정보</h2>
            </div>
            <div class="alert-switch">
              <span>변동 알림</span>
              <el-switch v-model="notificationOn" @change="changeNotification" />
            </div>
          </div>

          <div class="prepare-list">
            <span v-for="item in preparationItems" :key="item">{{ item }}</span>
          </div>
          <div class="fun-message">
            <small>오늘의 야구장 한마디</small>
            <strong>{{ funMessage }}</strong>
          </div>
        </article>
      </section>
    </main>
  </div>
</template>

<style scoped>
.dashboard-page {
  color: #1b273b;
  background: #f2f5f9;
}
.data-status,
.panel-head,
.filters,
.alert-switch {
  display: flex;
  align-items: center;
}

.ops-main { width: min(100% - 48px, 1440px); margin: 0 auto; padding: 36px 0 50px; }
.page-intro { display: flex; align-items: flex-end; justify-content: space-between; gap: 30px; margin-bottom: 20px; }
.eyebrow,
.panel-label { color: #3267e3; font-size: 10px; font-weight: 900; letter-spacing: 0.12em; }
.page-intro h1 { margin: 8px 0 7px; color: #172236; font-size: clamp(24px, 3vw, 36px); letter-spacing: -0.04em; }
.page-intro p { margin: 0; color: #68758a; font-size: 14px; }
.data-status { flex: 0 0 auto; gap: 10px; padding: 12px 15px; background: #ffffff; border: 1px solid #e1e7ef; border-radius: 8px; }
.data-status strong,
.data-status small { display: block; }
.data-status strong { color: #28364d; font-size: 12px; }
.data-status small { margin-top: 3px; color: #8490a2; font-size: 10px; }
.status-dot { width: 9px; height: 9px; background: #27a47b; border-radius: 50%; box-shadow: 0 0 0 4px #e2f4ee; }
.sample-notice { margin-bottom: 16px; padding: 10px 14px; color: #6c5a2d; background: #fff8e8; border: 1px solid #f1dfb7; border-radius: 7px; font-size: 11px; }

.summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 18px; }
.panel { padding: 22px; background: #ffffff; border: 1px solid #e1e7ef; border-radius: 11px; box-shadow: 0 8px 25px rgba(26, 40, 67, 0.05); }
.panel-head { justify-content: space-between; gap: 20px; margin-bottom: 18px; }
.panel-head.compact { align-items: flex-start; }
.panel-head h2 { margin: 4px 0 0; color: #1a263a; font-size: 18px; letter-spacing: -0.02em; }
.filters { width: min(100%, 470px); gap: 8px; }
.filters .el-input { flex: 1.3; }
.filters .el-select { flex: 1; }
.schedule-panel { margin-bottom: 18px; }

.analysis-grid { display: grid; grid-template-columns: 1.25fr 0.75fr; gap: 18px; margin-bottom: 18px; }
.risk-main { display: grid; grid-template-columns: 180px 1fr; align-items: center; gap: 20px; padding: 12px 0 20px; }
.risk-copy h3 { margin: 10px 0 5px; font-size: 20px; }
.risk-copy p { margin: 0; color: #738096; font-size: 12px; }
.risk-copy ul { display: flex; flex-wrap: wrap; gap: 7px; margin: 15px 0 0; padding: 0; list-style: none; }
.risk-copy li { padding: 6px 8px; color: #58677d; background: #f2f5f8; border-radius: 5px; font-size: 11px; }
.risk-state { display: inline-block; padding: 6px 9px; border-radius: 5px; font-size: 11px; font-weight: 900; }
.risk-state.safe,
.risk-state.dome { color: #167758; background: #e6f5ef; }
.risk-state.warning { color: #92601e; background: #fff1da; }
.risk-state.danger { color: #a62f3a; background: #fde8ea; }
.weather-metrics { display: grid; grid-template-columns: repeat(4, 1fr); margin-bottom: 16px; border: 1px solid #e6eaf1; border-radius: 8px; }
.weather-metrics div { padding: 12px; border-right: 1px solid #e6eaf1; }
.weather-metrics div:last-child { border-right: 0; }
.weather-metrics span,
.weather-metrics strong { display: block; }
.weather-metrics span { color: #8490a2; font-size: 10px; }
.weather-metrics strong { margin-top: 4px; font-size: 13px; }
.favorite-btn { padding: 7px 10px; color: #3267e3; background: #edf3ff; border: 1px solid #d5e2ff; border-radius: 6px; font-size: 11px; }

.simple-badge { padding: 6px 8px; color: #67758a; background: #f1f4f8; border-radius: 5px; font-size: 10px; font-weight: 800; }
.scoreboard { display: grid; grid-template-columns: 1fr 85px 1fr; align-items: center; min-height: 175px; padding: 20px; color: #ffffff; background: #142137; border-radius: 9px; }
.team-score { text-align: center; }
.team-score span,
.team-score b,
.team-score strong { display: block; }
.team-score span { color: #7487a5; font-size: 9px; letter-spacing: 0.12em; }
.team-score b { margin: 7px 0; font-size: 16px; }
.team-score strong { font-size: 42px; }
.score-center { color: #8190a8; text-align: center; }
.score-center span,
.score-center b,
.score-center small { display: block; }
.score-center b { margin: 3px 0; color: #ffffff; font-size: 25px; }
.score-center small { font-size: 10px; }
.score-summary { display: flex; align-items: center; justify-content: space-between; margin-top: 13px; padding: 11px 13px; background: #f5f7fa; border-radius: 7px; font-size: 12px; }
.watch-point { margin: 12px 0 0; color: #657288; font-size: 12px; line-height: 1.6; }

.bottom-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
.record-table { border: 1px solid #e5eaf2; border-radius: 8px; }
.record-table > div { display: grid; grid-template-columns: 1fr 100px 1fr; padding: 11px 14px; border-bottom: 1px solid #edf0f5; text-align: center; }
.record-table > div:last-child { border-bottom: 0; }
.record-table .record-head { color: #ffffff; background: #21304a; border-radius: 7px 7px 0 0; }
.record-table span { color: #7c889b; font-size: 11px; }
.record-table strong { color: #26344a; font-size: 12px; }
.record-head span,
.record-head b { color: #ffffff; font-size: 12px; }
.alert-switch { gap: 8px; color: #6c788b; font-size: 11px; }
.prepare-list { display: flex; flex-wrap: wrap; gap: 8px; }
.prepare-list span { padding: 8px 11px; color: #31527f; background: #edf4ff; border: 1px solid #dbe8fb; border-radius: 6px; font-size: 11px; font-weight: 700; }
.fun-message { margin-top: 18px; padding: 18px; color: #f5f8ff; background: linear-gradient(135deg, #263b60, #18263e); border-radius: 8px; }
.fun-message small,
.fun-message strong { display: block; }
.fun-message small { color: #8fa2c0; font-size: 10px; }
.fun-message strong { margin-top: 8px; font-size: 15px; line-height: 1.5; }

@media (max-width: 1050px) {
  .summary-grid { grid-template-columns: repeat(2, 1fr); }
  .analysis-grid,
  .bottom-grid { grid-template-columns: 1fr; }
}

@media (max-width: 680px) {
  .ops-main { width: min(100% - 24px, 1440px); padding-top: 24px; }
  .page-intro { align-items: flex-start; flex-direction: column; }
  .data-status { width: 100%; }
  .summary-grid { grid-template-columns: 1fr 1fr; gap: 9px; }
  .panel { padding: 16px; }
  .panel-head { align-items: flex-start; flex-direction: column; }
  .filters { width: 100%; }
  .risk-main { grid-template-columns: 1fr; justify-items: center; text-align: center; }
  .risk-copy ul { justify-content: center; }
  .weather-metrics { grid-template-columns: 1fr 1fr; }
  .weather-metrics div:nth-child(2) { border-right: 0; }
  .weather-metrics div:nth-child(-n + 2) { border-bottom: 1px solid #e6eaf1; }
  .scoreboard { grid-template-columns: 1fr 55px 1fr; padding: 14px; }
  .record-table > div { grid-template-columns: 1fr 70px 1fr; padding: 10px 8px; }
}
</style>
