<script setup>
import { computed, ref } from 'vue'
import { ElOption, ElProgress, ElSelect } from 'element-plus'
import { baseballGames } from '@/data/baseball/baseballData.js'

// 경기 데이터에 있는 양 팀을 하나의 순위 목록으로 만든다.
const teams = baseballGames
  .flatMap((game) => [game.away, game.home])
  .sort((a, b) => a.rank - b.rank)

const leftTeamName = ref(teams[0].name)
const rightTeamName = ref(teams[1].name)

const leftTeam = computed(() => teams.find((team) => team.name === leftTeamName.value))
const rightTeam = computed(() => teams.find((team) => team.name === rightTeamName.value))

const winRate = (team) => Number(((team.wins / (team.wins + team.losses)) * 100).toFixed(1))
const gamesBehind = (team) => teams[0].wins - team.wins
</script>

<template>
  <div class="sub-page records-page">
    <div class="sub-page-head">
      <div>
        <span class="eyebrow">TEAM PERFORMANCE CENTER</span>
        <h2>팀 기록 및 전력 비교</h2>
        <p>시즌 순위, 승률, 최근 흐름을 기준으로 두 팀의 간단한 전력을 비교합니다.</p>
      </div>
      <div class="sample-label">실습용 시즌 기록</div>
    </div>

    <section class="page-grid-2 records-main">
      <article class="enterprise-panel ranking-panel">
        <div class="enterprise-panel-head"><div><h3>시즌 팀 순위</h3><span>승률 기준 샘플 순위</span></div></div>
        <div class="ranking-head"><span>순위</span><span>팀</span><span>경기</span><span>승</span><span>패</span><span>승률</span></div>
        <div v-for="team in teams" :key="team.name" class="ranking-row">
          <b>{{ team.rank }}</b>
          <strong>{{ team.name }}</strong>
          <span>{{ team.wins + team.losses }}</span>
          <span>{{ team.wins }}</span>
          <span>{{ team.losses }}</span>
          <em>{{ winRate(team) }}%</em>
        </div>
      </article>

      <article class="enterprise-panel compare-panel">
        <div class="enterprise-panel-head"><div><h3>맞대결 전력 비교</h3><span>비교할 두 팀을 선택하세요.</span></div></div>
        <div class="team-selects">
          <el-select v-model="leftTeamName" aria-label="첫 번째 비교 팀">
            <el-option v-for="team in teams" :key="team.name" :label="team.name" :value="team.name" />
          </el-select>
          <span>VS</span>
          <el-select v-model="rightTeamName" aria-label="두 번째 비교 팀">
            <el-option v-for="team in teams" :key="team.name" :label="team.name" :value="team.name" />
          </el-select>
        </div>

        <div class="compare-score">
          <div><span>{{ leftTeam.rank }}위</span><strong>{{ leftTeam.shortName }}</strong><b>{{ winRate(leftTeam) }}</b><small>승률 %</small></div>
          <div class="versus"><span>TEAM</span><b>VS</b><small>COMPARE</small></div>
          <div><span>{{ rightTeam.rank }}위</span><strong>{{ rightTeam.shortName }}</strong><b>{{ winRate(rightTeam) }}</b><small>승률 %</small></div>
        </div>

        <div class="compare-bars">
          <div>
            <span>시즌 승률</span>
            <el-progress :percentage="winRate(leftTeam)" color="#3267e3" />
            <el-progress :percentage="winRate(rightTeam)" color="#dc4b55" />
          </div>
          <div class="flow-row"><span>최근 흐름</span><b>{{ leftTeam.streak }}</b><b>{{ rightTeam.streak }}</b></div>
          <div class="flow-row"><span>선두와 승차</span><b>{{ gamesBehind(leftTeam) }}경기</b><b>{{ gamesBehind(rightTeam) }}경기</b></div>
        </div>
      </article>
    </section>

    <section class="enterprise-panel form-guide">
      <div class="enterprise-panel-head"><div><h3>최근 흐름 모니터</h3><span>연승과 연패 상태를 빠르게 확인합니다.</span></div></div>
      <div class="form-grid">
        <div v-for="team in teams" :key="team.name">
          <b>{{ team.rank }}</b><strong>{{ team.shortName }}</strong>
          <span :class="{ win: team.streak.includes('승'), lose: team.streak.includes('패') }">{{ team.streak }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.sample-label { padding: 8px 11px; color: #6c5a2d; background: #fff7e5; border: 1px solid #ead8ad; border-radius: 6px; font-size: 10px; }
.records-main { align-items: start; margin-bottom: 16px; }
.ranking-head,
.ranking-row { display: grid; grid-template-columns: 45px 1.5fr repeat(4, .65fr); align-items: center; gap: 8px; }
.ranking-head { padding: 9px 11px; color: #fff; background: #22304a; border-radius: 6px 6px 0 0; font-size: 9px; font-weight: 800; }
.ranking-row { padding: 9px 11px; border-bottom: 1px solid #edf0f4; color: #68758a; font-size: 10px; }
.ranking-row b { display: grid; place-items: center; width: 24px; height: 24px; color: #3267e3; background: #edf3ff; border-radius: 5px; }
.ranking-row strong { color: #26344a; }
.ranking-row em { color: #3267e3; font-style: normal; font-weight: 800; }
.team-selects { display: grid; grid-template-columns: 1fr 35px 1fr; align-items: center; gap: 8px; margin-bottom: 15px; }
.team-selects > span { color: #9aa5b6; font-size: 10px; font-weight: 900; text-align: center; }
.compare-score { display: grid; grid-template-columns: 1fr 65px 1fr; align-items: center; padding: 20px; color: #fff; background: #17253c; border-radius: 8px; text-align: center; }
.compare-score div > span,
.compare-score div > strong,
.compare-score div > b,
.compare-score div > small { display: block; }
.compare-score div > span { color: #8495b0; font-size: 9px; }
.compare-score div > strong { margin: 6px 0; font-size: 15px; }
.compare-score div > b { font-size: 30px; }
.compare-score div > small { color: #7788a3; font-size: 8px; }
.versus b { color: #5e86e8; font-size: 17px !important; }
.compare-bars { margin-top: 15px; }
.compare-bars > div { padding: 10px 0; border-bottom: 1px solid #edf0f4; }
.compare-bars span { color: #778398; font-size: 10px; }
.compare-bars .el-progress { margin-top: 7px; }
.flow-row { display: grid; grid-template-columns: 1fr 85px 85px; text-align: right; }
.flow-row b { color: #2d3a50; font-size: 11px; }
.form-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 9px; }
.form-grid div { display: grid; grid-template-columns: 25px 1fr auto; align-items: center; gap: 7px; padding: 11px; background: #f7f9fc; border: 1px solid #e6eaf1; border-radius: 7px; }
.form-grid b { color: #8490a2; font-size: 9px; }
.form-grid strong { color: #2c394e; font-size: 10px; }
.form-grid span { padding: 4px 6px; border-radius: 4px; font-size: 9px; font-weight: 800; }
.form-grid span.win { color: #177355; background: #e7f5ef; }
.form-grid span.lose { color: #a33640; background: #fde9ea; }
@media (max-width: 750px) {
  .ranking-panel { overflow-x: auto; }
  .ranking-head, .ranking-row { min-width: 580px; }
  .form-grid { grid-template-columns: 1fr 1fr; }
}
</style>
