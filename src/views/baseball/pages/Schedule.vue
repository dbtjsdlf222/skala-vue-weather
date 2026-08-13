<script setup>
import { computed, ref } from 'vue'
import { ElInput, ElOption, ElSelect } from 'element-plus'
import GameSchedule from '@/components/baseball/GameSchedule.vue'
import SummaryCard from '@/components/baseball/SummaryCard.vue'
import { baseballGames, riskOptions } from '@/data/baseball/baseballData.js'
import { calculateCancelRisk, getRiskInfo } from '@/utils/baseball/weatherRisk.js'

const games = ref(
  baseballGames.map((game) => ({
    ...game,
    cancelRisk: calculateCancelRisk(game.weather, game.isDome),
  })),
)
const selectedId = ref(games.value[0].id)
const search = ref('')
const riskFilter = ref('all')
const dateFilter = ref('오늘')

// 현재 선택한 날짜에 포함된 경기만 가져온다.
const dateGames = computed(() => {
  return games.value.filter((game) => game.scheduleDay === dateFilter.value)
})

const filteredGames = computed(() => {
  return dateGames.value.filter((game) => {
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

// 날짜 탭을 바꾸면 해당 날짜의 첫 번째 경기를 선택한다.
const changeDate = (date) => {
  dateFilter.value = date
  selectedId.value = dateGames.value[0]?.id || ''
}

const outdoorCount = computed(() => dateGames.value.filter((game) => !game.isDome).length)
const dangerCount = computed(() => dateGames.value.filter((game) => game.cancelRisk >= 60).length)
const closeGames = computed(() => dateGames.value.filter((game) => {
  return Math.abs(game.expectedScore.away - game.expectedScore.home) <= 1
}).length)
</script>

<template>
  <div class="sub-page schedule-page">
    <div class="sub-page-head">
      <div>
        <span class="eyebrow">FULL GAME SCHEDULE</span>
        <h2>경기 일정 통합 관리</h2>
        <p>경기별 날씨 위험도와 예상 점수 차를 한 화면에서 확인합니다.</p>
      </div>
      <div class="date-tabs">
        <button v-for="date in ['오늘', '내일', '주말']" :key="date" :class="{ active: dateFilter === date }" @click="changeDate(date)">
          {{ date }}
        </button>
      </div>
    </div>

    <section class="schedule-summary">
      <SummaryCard label="전체 경기" description="선택 날짜의 샘플 일정">{{ dateGames.length }}경기</SummaryCard>
      <SummaryCard label="야외 경기" description="기상 영향 대상" tone="green">{{ outdoorCount }}경기</SummaryCard>
      <SummaryCard label="취소 위험" description="위험도 60% 이상" tone="red">{{ dangerCount }}경기</SummaryCard>
      <SummaryCard label="접전 예상" description="예상 점수 차 1점 이하" tone="orange">{{ closeGames }}경기</SummaryCard>
    </section>

    <section class="enterprise-panel">
      <div class="enterprise-panel-head schedule-control">
        <div>
          <h3>{{ dateFilter }} 경기 목록</h3>
          <span>경기를 선택하면 통합 대시보드에서 상세 정보를 볼 수 있습니다.</span>
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
        <div><h3>{{ dateFilter }} 운영 타임라인</h3><span>경기 진행 판단 권장 시점</span></div>
      </div>
      <div class="timeline-row">
        <div><b>15:00</b><span>구장별 1차 기상 확인</span></div>
        <div><b>16:30</b><span>현장 방수포 및 그라운드 점검</span></div>
        <div><b>17:30</b><span>관중 입장 전 운영 판단</span></div>
        <div><b>18:30</b><span>경기 시작 예정</span></div>
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
