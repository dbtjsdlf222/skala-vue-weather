<script setup>
import { ElProgress } from 'element-plus'
import { getRiskInfo } from '@/utils/baseball/weatherRisk.js'

defineProps({
  games: { type: Array, required: true },
  selectedId: { type: String, default: '' },
})

const emit = defineEmits(['select'])
</script>

<template>
  <div class="schedule-table">
    <div class="table-head">
      <span>시간</span><span>경기</span><span>구장</span>
      <span>날씨</span><span>취소 가능성</span><span>운영 전망</span>
    </div>

    <button
      v-for="game in games"
      :key="game.id"
      class="game-row"
      :class="{ selected: selectedId === game.id }"
      @click="emit('select', game.id)"
    >
      <strong class="game-time">{{ game.time }}</strong>
      <span class="matchup"><b>{{ game.away.shortName }}</b><small>VS</small><b>{{ game.home.shortName }}</b></span>
      <span class="stadium">{{ game.stadium }}</span>
      <span class="weather-cell">
        <b>{{ game.weather.status }}</b>
        <small>{{ game.weather.temp }}도 · {{ game.weather.rain }}mm</small>
      </span>
      <span class="risk-progress">
        <el-progress
          :percentage="game.cancelRisk"
          :stroke-width="8"
          :color="game.cancelRisk >= 60 ? '#dc4b55' : game.cancelRisk >= 30 ? '#e9902a' : '#24936f'"
        />
      </span>
      <span class="risk-label" :class="getRiskInfo(game.cancelRisk, game.isDome).level">
        {{ getRiskInfo(game.cancelRisk, game.isDome).label }}
      </span>
    </button>

    <p v-if="games.length === 0" class="empty-list">조건에 맞는 경기가 없습니다.</p>
  </div>
</template>

<style scoped>
.schedule-table { overflow: hidden; border: 1px solid #e5eaf2; border-radius: 9px; }
.table-head,
.game-row { display: grid; grid-template-columns: 70px 1.1fr 1.25fr 1fr 1.1fr 95px; align-items: center; gap: 14px; }
.table-head { padding: 11px 16px; color: #718096; background: #f7f9fc; border-bottom: 1px solid #e5eaf2; font-size: 11px; font-weight: 800; }
.game-row { width: 100%; min-height: 72px; padding: 13px 16px; text-align: left; background: #ffffff; border: 0; border-bottom: 1px solid #edf0f5; border-radius: 0; }
.game-row:last-of-type { border-bottom: 0; }
.game-row:hover,
.game-row.selected { background: #f2f6ff; transform: none; }
.game-row.selected { box-shadow: inset 3px 0 #3267e3; }
.game-time { color: #18243a; font-size: 14px; }
.matchup { display: flex; align-items: center; gap: 7px; color: #1d2a40; }
.matchup small { color: #9aa5b5; font-size: 10px; }
.stadium,
.weather-cell { min-width: 0; color: #546176; font-size: 12px; }
.stadium { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.weather-cell b,
.weather-cell small { display: block; }
.weather-cell b { color: #29364c; }
.weather-cell small { margin-top: 3px; color: #8994a7; }
.risk-label { padding: 6px 8px; border-radius: 6px; font-size: 11px; font-weight: 800; text-align: center; }
.risk-label.safe,
.risk-label.dome { color: #167758; background: #e6f5ef; }
.risk-label.warning { color: #92601e; background: #fff1da; }
.risk-label.danger { color: #a62f3a; background: #fde8ea; }
.empty-list { margin: 0; padding: 35px; color: #7f8a9d; text-align: center; }
@media (max-width: 950px) {
  .table-head { display: none; }
  .game-row { grid-template-columns: 60px 1fr 110px; }
  .stadium, .weather-cell, .risk-progress { display: none; }
}
</style>
