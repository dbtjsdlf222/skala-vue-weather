<script setup>
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { ElInput, ElOption, ElSelect } from 'element-plus'
import GameSchedule from '@/components/baseball/GameSchedule.vue'
import SummaryCard from '@/components/baseball/SummaryCard.vue'
import { riskOptions } from '@/data/baseball/baseballData.js'
import { getDateKey, getWeekendDate, useBaseballStore } from '@/stores/baseballStore.js'
import { getRiskInfo } from '@/utils/baseball/weatherRisk.js'

const baseballStore = useBaseballStore()
const { games, isLoading, dataSource, errorMessage } = storeToRefs(baseballStore)
const dateOptions = [
  { label: '오늘', date: getDateKey() },
  { label: '내일', date: getDateKey(1) },
  { label: '주말', date: getWeekendDate() },
]

const selectedId = ref('')
const selectedDate = ref(dateOptions[0].date)
const search = ref('')
const riskFilter = ref('all')

const selectedDateLabel = computed(() => {
  const option = dateOptions.find((item) => item.date === selectedDate.value)
  return `${option?.label || '선택일'} · ${selectedDate.value}`
})

const filteredGames = computed(() => {
  return games.value.filter((game) => {
    const keyword = search.value.trim()
    const level = getRiskInfo(game.cancelRisk, game.isDome).level
    const sameKeyword =
      !keyword || game.away.name.includes(keyword) || game.home.name.includes(keyword) || game.stadium.includes(keyword)
    const sameLevel =
      riskFilter.value === 'all' ||
      (riskFilter.value === 'safe' && (level === 'safe' || level === 'dome')) ||
      level === riskFilter.value
    return sameKeyword && sameLevel
  })
})

const outdoorCount = computed(() => games.value.filter((game) => !game.isDome).length)
const dangerCount = computed(() => games.value.filter((game) => game.cancelRisk >= 60).length)
const forecastCount = computed(() => games.value.filter((game) => game.weather.forecastTime).length)

async function changeDate(option) {
  selectedDate.value = option.date
  selectedId.value = ''
  await baseballStore.loadGames(option.date)
  selectedId.value = games.value[0]?.id || ''
}

onMounted(() => changeDate(dateOptions[0]))
</script>

<template>
  <div class="sub-page schedule-page">
    <div class="sub-page-head">
      <div>
        <span class="eyebrow">KBO GAME SCHEDULE</span>
        <h2>공식 경기 일정과 시간대별 날씨</h2>
        <p>KBO 경기 시간과 가장 가까운 OpenWeather 3시간 예보를 함께 확인합니다.</p>
      </div>
      <div class="date-tabs">
        <button
          v-for="option in dateOptions"
          :key="option.label"
          :class="{ active: selectedDate === option.date }"
          @click="changeDate(option)"
        >
          {{ option.label }}
        </button>
      </div>
    </div>

    <section class="schedule-summary">
      <SummaryCard label="전체 경기" description="KBO 공식 일정">{{ games.length }}경기</SummaryCard>
      <SummaryCard label="야외 경기" description="기상 영향 대상" tone="green">{{ outdoorCount }}경기</SummaryCard>
      <SummaryCard label="취소 위험" description="위험도 60% 이상" tone="red">{{ dangerCount }}경기</SummaryCard>
      <SummaryCard label="시간 예보" description="경기 시간 인접 예보" tone="orange">{{ forecastCount }}경기</SummaryCard>
    </section>

    <section class="enterprise-panel">
      <div class="enterprise-panel-head schedule-control">
        <div>
          <h3>{{ selectedDateLabel }} 경기 목록</h3>
          <span>{{ isLoading ? '일정과 예보를 불러오는 중입니다.' : dataSource }}</span>
          <span v-if="errorMessage" class="error-message">{{ errorMessage }}</span>
        </div>
        <div class="schedule-filters">
          <el-input v-model="search" placeholder="팀 또는 구장 검색" clearable />
          <el-select v-model="riskFilter" aria-label="경기 위험도 필터">
            <el-option v-for="option in riskOptions" :key="option.value" :label="option.label" :value="option.value" />
          </el-select>
        </div>
      </div>
      <GameSchedule :games="filteredGames" :selected-id="selectedId" @select="selectedId = $event" />
    </section>

    <section class="timeline enterprise-panel">
      <div class="enterprise-panel-head">
        <div><h3>관람 전 확인 순서</h3><span>실제로 필요한 정보만 간단히 정리했습니다.</span></div>
      </div>
      <div class="timeline-row">
        <div><b>1</b><span>관람할 날짜의 공식 경기 확인</span></div>
        <div><b>2</b><span>구장과 경기 시작 시간 확인</span></div>
        <div><b>3</b><span>경기 시간의 강수확률 확인</span></div>
        <div><b>4</b><span>필요하면 구단 취소 공지 확인</span></div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.date-tabs { display: flex; padding: 4px; background: #e8edf4; border-radius: 7px; }
.date-tabs button { padding: 7px 14px; color: #718096; background: transparent; border: 0; font-size: 11px; }
.date-tabs button.active { color: #ffffff; background: #3267e3; }
.schedule-summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 13px; margin-bottom: 16px; }
.schedule-control { align-items: flex-end; }
.schedule-control span { display: block; }
.error-message { margin-top: 4px; color: #a85d30; }
.schedule-filters { display: flex; width: min(100%, 470px); gap: 8px; }
.schedule-filters .el-input { flex: 1.2; }
.schedule-filters .el-select { flex: 1; }
.timeline { margin-top: 16px; }
.timeline-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; border: 1px solid #e3e8f0; border-radius: 8px; }
.timeline-row div { position: relative; padding: 17px; border-right: 1px solid #e3e8f0; }
.timeline-row div:last-child { border-right: 0; }
.timeline-row b,
.timeline-row span { display: block; }
.timeline-row b { color: #3267e3; font-size: 13px; }
.timeline-row span { margin-top: 5px; color: #69768a; font-size: 10px; }
@media (max-width: 900px) {
  .schedule-summary { grid-template-columns: repeat(2, 1fr); }
  .timeline-row { grid-template-columns: 1fr 1fr; }
  .timeline-row div:nth-child(2) { border-right: 0; }
  .timeline-row div:nth-child(-n + 2) { border-bottom: 1px solid #e3e8f0; }
}
@media (max-width: 600px) {
  .schedule-filters { width: 100%; }
}
</style>
