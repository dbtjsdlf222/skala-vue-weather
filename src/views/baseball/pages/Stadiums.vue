<script setup>
import { computed, ref } from 'vue'
import { ElProgress } from 'element-plus'
import { baseballGames } from '@/data/baseball/baseballData.js'
import { calculateCancelRisk, getRiskInfo, getRiskReasons } from '@/utils/baseball/weatherRisk.js'

const stadiums = ref(
  baseballGames.map((game) => ({
    ...game,
    cancelRisk: calculateCancelRisk(game.weather, game.isDome),
  })),
)
const selectedId = ref(stadiums.value[0].id)

const selectedStadium = computed(() => {
  return stadiums.value.find((stadium) => stadium.id === selectedId.value) || stadiums.value[0]
})
const selectedRisk = computed(() => getRiskInfo(selectedStadium.value.cancelRisk, selectedStadium.value.isDome))
const reasons = computed(() => getRiskReasons(selectedStadium.value.weather, selectedStadium.value.isDome))

const weatherScore = (stadium) => {
  return Math.max(100 - stadium.cancelRisk, 5)
}
</script>

<template>
  <div class="sub-page stadium-page">
    <div class="sub-page-head">
      <div>
        <span class="eyebrow">STADIUM WEATHER NETWORK</span>
        <h2>구장별 기상 관제</h2>
        <p>5개 구장의 강수량, 습도, 풍속과 경기 적합도를 비교합니다.</p>
      </div>
      <div class="network-status"><span></span> 5개 구장 데이터 연결</div>
    </div>

    <section class="stadium-grid">
      <button
        v-for="stadium in stadiums"
        :key="stadium.id"
        class="stadium-card"
        :class="{ selected: selectedId === stadium.id }"
        @click="selectedId = stadium.id"
      >
        <div class="stadium-card-head">
          <span>{{ stadium.city }}</span>
          <b class="status-chip" :class="getRiskInfo(stadium.cancelRisk, stadium.isDome).level">
            {{ getRiskInfo(stadium.cancelRisk, stadium.isDome).label }}
          </b>
        </div>
        <h3>{{ stadium.stadium }}</h3>
        <div class="stadium-temp">{{ stadium.weather.temp }}<small>도</small></div>
        <p>{{ stadium.weather.status }} · 강수 {{ stadium.weather.rain }}mm</p>
        <el-progress :percentage="weatherScore(stadium)" :stroke-width="7" color="#3267e3" />
        <small class="fit-label">경기 적합도</small>
      </button>
    </section>

    <section class="page-grid-2 stadium-detail-grid">
      <article class="enterprise-panel detail-panel">
        <div class="enterprise-panel-head">
          <div><h3>{{ selectedStadium.stadium }} 상세 관측</h3><span>{{ selectedStadium.city }} · {{ selectedStadium.time }} 경기</span></div>
          <span class="status-chip" :class="selectedRisk.level">{{ selectedRisk.label }}</span>
        </div>

        <div class="observation-grid">
          <div><span>현재 기온</span><strong>{{ selectedStadium.weather.temp }}도</strong><small>관람 적정</small></div>
          <div><span>시간당 강수</span><strong>{{ selectedStadium.weather.rain }}mm</strong><small>{{ selectedStadium.weather.status }}</small></div>
          <div><span>상대 습도</span><strong>{{ selectedStadium.weather.humidity }}%</strong><small>그라운드 영향</small></div>
          <div><span>평균 풍속</span><strong>{{ selectedStadium.weather.wind }}m/s</strong><small>타구 영향 확인</small></div>
        </div>

        <div class="risk-bar">
          <div><span>경기 취소 가능성</span><strong>{{ selectedStadium.cancelRisk }}%</strong></div>
          <el-progress
            :percentage="selectedStadium.cancelRisk"
            :stroke-width="12"
            :color="selectedStadium.cancelRisk >= 60 ? '#dc4b55' : selectedStadium.cancelRisk >= 30 ? '#e9902a' : '#24936f'"
          />
        </div>
      </article>

      <article class="enterprise-panel decision-panel">
        <div class="enterprise-panel-head"><div><h3>현장 운영 권고</h3><span>관측값 기반 체크 포인트</span></div></div>
        <div class="decision-message" :class="selectedRisk.level">
          <strong>{{ selectedRisk.label }}</strong>
          <p v-if="selectedRisk.level === 'danger'">구단 공식 공지와 현장 그라운드 상태를 확인해야 합니다.</p>
          <p v-else-if="selectedRisk.level === 'warning'">경기 시작 1시간 전 강수 추이를 다시 확인하는 것이 좋습니다.</p>
          <p v-else>현재 관측값 기준으로 정상 진행 가능성이 높습니다.</p>
        </div>
        <ul class="reason-list">
          <li v-for="reason in reasons" :key="reason"><span>CHECK</span>{{ reason }}</li>
          <li><span>VENUE</span>{{ selectedStadium.isDome ? '실내 돔구장' : '야외 구장' }}</li>
        </ul>
      </article>
    </section>

    <section class="enterprise-panel comparison-panel">
      <div class="enterprise-panel-head"><div><h3>구장 기상 비교표</h3><span>위험도가 높은 순서로 현장 확인을 권장합니다.</span></div></div>
      <div class="comparison-row head"><span>구장</span><span>기온</span><span>강수량</span><span>습도</span><span>풍속</span><span>취소 위험</span></div>
      <div v-for="stadium in [...stadiums].sort((a, b) => b.cancelRisk - a.cancelRisk)" :key="stadium.id" class="comparison-row">
        <strong>{{ stadium.stadium }}</strong>
        <span>{{ stadium.weather.temp }}도</span>
        <span>{{ stadium.weather.rain }}mm</span>
        <span>{{ stadium.weather.humidity }}%</span>
        <span>{{ stadium.weather.wind }}m/s</span>
        <b>{{ stadium.cancelRisk }}%</b>
      </div>
    </section>
  </div>
</template>

<style scoped>
.network-status { padding: 9px 12px; color: #526077; background: #fff; border: 1px solid #dfe5ed; border-radius: 7px; font-size: 10px; }
.network-status span { display: inline-block; width: 7px; height: 7px; margin-right: 6px; background: #2caf83; border-radius: 50%; }
.stadium-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 11px; margin-bottom: 16px; }
.stadium-card { padding: 16px; text-align: left; background: #fff; border: 1px solid #e0e6ee; border-radius: 9px; box-shadow: 0 5px 18px rgba(29, 43, 69, .04); }
.stadium-card:hover,
.stadium-card.selected { border-color: #7c9eed; transform: none; }
.stadium-card.selected { box-shadow: inset 0 3px #3267e3; }
.stadium-card-head { display: flex; align-items: center; justify-content: space-between; gap: 5px; color: #748198; font-size: 10px; }
.stadium-card h3 { min-height: 34px; margin: 13px 0 7px; color: #26344a; font-size: 12px; }
.stadium-temp { color: #16243a; font-size: 31px; font-weight: 900; }
.stadium-temp small { font-size: 12px; }
.stadium-card p { margin: 4px 0 14px; color: #788498; font-size: 9px; }
.fit-label { display: block; margin-top: 4px; color: #8b96a7; font-size: 8px; text-align: right; }
.stadium-detail-grid { margin-bottom: 16px; }
.observation-grid { display: grid; grid-template-columns: 1fr 1fr; border: 1px solid #e4e9f0; border-radius: 8px; }
.observation-grid div { padding: 15px; border-right: 1px solid #e4e9f0; border-bottom: 1px solid #e4e9f0; }
.observation-grid div:nth-child(2n) { border-right: 0; }
.observation-grid div:nth-last-child(-n + 2) { border-bottom: 0; }
.observation-grid span,
.observation-grid strong,
.observation-grid small { display: block; }
.observation-grid span { color: #8490a2; font-size: 9px; }
.observation-grid strong { margin: 5px 0 3px; color: #26344a; font-size: 19px; }
.observation-grid small { color: #9aa4b4; font-size: 8px; }
.risk-bar { margin-top: 15px; padding: 14px; background: #f6f8fb; border-radius: 8px; }
.risk-bar > div { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 11px; }
.decision-message { padding: 17px; border-left: 3px solid; border-radius: 6px; }
.decision-message.safe,
.decision-message.dome { color: #176a52; background: #edf8f4; border-color: #24936f; }
.decision-message.warning { color: #80561e; background: #fff7e8; border-color: #e9902a; }
.decision-message.danger { color: #92323c; background: #fff0f1; border-color: #dc4b55; }
.decision-message p { margin: 6px 0 0; font-size: 11px; line-height: 1.6; }
.reason-list { margin: 15px 0 0; padding: 0; list-style: none; }
.reason-list li { padding: 10px 0; color: #536177; border-bottom: 1px solid #edf0f5; font-size: 11px; }
.reason-list span { display: inline-block; width: 55px; color: #3267e3; font-size: 8px; font-weight: 900; }
.comparison-row { display: grid; grid-template-columns: 1.7fr repeat(5, 1fr); gap: 12px; padding: 11px 13px; border-bottom: 1px solid #edf0f4; color: #68758a; font-size: 10px; }
.comparison-row.head { color: #fff; background: #22304a; border-radius: 6px 6px 0 0; font-weight: 800; }
.comparison-row strong { color: #27354b; }
.comparison-row b { color: #3267e3; }
@media (max-width: 1100px) { .stadium-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 700px) {
  .stadium-grid { grid-template-columns: 1fr 1fr; }
  .comparison-panel { overflow-x: auto; }
  .comparison-row { min-width: 680px; }
}
</style>
