<script setup>
import { computed, ref } from 'vue'
import { ElMessage, ElSwitch } from 'element-plus'

const notificationOn = ref(localStorage.getItem('operationAlert') === 'true')
const checks = ref([
  { id: 1, label: '구장별 최신 강수량 확인', done: true },
  { id: 2, label: '현장 그라운드 상태 확인', done: true },
  { id: 3, label: '구단 공식 공지 채널 확인', done: false },
  { id: 4, label: '관중 입장 안내 준비', done: false },
])

const completedCount = computed(() => checks.value.filter((item) => item.done).length)
const completionRate = computed(() => Math.round((completedCount.value / checks.value.length) * 100))

const toggleCheck = (item) => {
  item.done = !item.done
}

const changeAlert = (value) => {
  localStorage.setItem('operationAlert', value)
  ElMessage.success(value ? '운영 변동 알림을 켰습니다.' : '운영 변동 알림을 껐습니다.')
}

const logs = [
  { time: '15:10', level: '정상', stadium: '대구', text: '강수 없음, 정상 운영 유지' },
  { time: '15:05', level: '위험', stadium: '광주', text: '강수량 8.4mm, 현장 확인 요청' },
  { time: '14:55', level: '주의', stadium: '잠실', text: '약한 비 지속, 16시 재확인 예정' },
  { time: '14:40', level: '정상', stadium: '고척', text: '돔구장 운영 상태 정상' },
  { time: '14:30', level: '주의', stadium: '창원', text: '이슬비 관측, 방수포 준비' },
]
</script>

<template>
  <div class="sub-page operations-page">
    <div class="sub-page-head">
      <div>
        <span class="eyebrow">GAME OPERATIONS CONTROL</span>
        <h2>경기 운영 관리 센터</h2>
        <p>취소 확률의 계산 기준과 현장 확인 작업, 최근 운영 로그를 관리합니다.</p>
      </div>
      <div class="operation-alert"><span>실시간 변동 알림</span><el-switch v-model="notificationOn" @change="changeAlert" /></div>
    </div>

    <section class="operations-summary">
      <article><span>운영 상태</span><strong>MONITORING</strong><small>전체 구장 감시 중</small></article>
      <article><span>체크리스트</span><strong>{{ completedCount }} / {{ checks.length }}</strong><small>{{ completionRate }}% 완료</small></article>
      <article><span>최우선 확인</span><strong>광주</strong><small>취소 가능성 72%</small></article>
      <article><span>다음 판단</span><strong>16:30</strong><small>현장 상태 재점검</small></article>
    </section>

    <section class="page-grid-2 operations-main">
      <article class="enterprise-panel rule-panel">
        <div class="enterprise-panel-head"><div><h3>취소 가능성 계산 기준</h3><span>복잡한 예측 모델 대신 단순한 조건문으로 계산합니다.</span></div></div>
        <div class="formula-box">
          <span>기본 위험도</span><b>+</b><span>강수량</span><b>+</b><span>습도</span><b>+</b><span>풍속</span><b>=</b><strong>취소 가능성</strong>
        </div>
        <div class="rule-table">
          <div class="head"><span>항목</span><span>조건</span><span>가산점</span></div>
          <div><strong>강수량</strong><span>시간당 5mm 이상</span><b>+45점</b></div>
          <div><strong>강수량</strong><span>시간당 1mm 이상</span><b>+30점</b></div>
          <div><strong>습도</strong><span>90% 이상</span><b>+12점</b></div>
          <div><strong>풍속</strong><span>8m/s 이상</span><b>+10점</b></div>
          <div><strong>돔구장</strong><span>실내 경기</span><b>2% 고정</b></div>
        </div>
        <p class="rule-note">실제 경기 취소는 구단과 심판진의 현장 판단으로 결정됩니다.</p>
      </article>

      <article class="enterprise-panel checklist-panel">
        <div class="enterprise-panel-head"><div><h3>경기 전 운영 체크리스트</h3><span>직접 눌러 완료 상태를 변경할 수 있습니다.</span></div><b>{{ completionRate }}%</b></div>
        <div class="completion-line"><span :style="{ width: `${completionRate}%` }"></span></div>
        <button v-for="item in checks" :key="item.id" class="check-item" :class="{ done: item.done }" @click="toggleCheck(item)">
          <span class="check-box">{{ item.done ? '완료' : '대기' }}</span>
          <strong>{{ item.label }}</strong>
        </button>
        <div class="operator-note"><span>담당자 메모</span><p>광주 구장은 강수량 변화를 우선 확인하고 16시 30분에 현장 상태를 다시 점검합니다.</p></div>
      </article>
    </section>

    <section class="enterprise-panel log-panel">
      <div class="enterprise-panel-head"><div><h3>최근 운영 이벤트</h3><span>구장별 상태 변경 기록</span></div><button>전체 로그 내보내기</button></div>
      <div class="log-head"><span>시간</span><span>단계</span><span>구장</span><span>내용</span><span>처리 상태</span></div>
      <div v-for="log in logs" :key="`${log.time}-${log.stadium}`" class="log-row">
        <b>{{ log.time }}</b>
        <span class="log-level" :class="log.level">{{ log.level }}</span>
        <strong>{{ log.stadium }}</strong>
        <span>{{ log.text }}</span>
        <em>확인 완료</em>
      </div>
    </section>
  </div>
</template>

<style scoped>
.operation-alert { display: flex; align-items: center; gap: 9px; padding: 9px 12px; background: #fff; border: 1px solid #e0e6ed; border-radius: 7px; color: #637086; font-size: 10px; }
.operations-summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 16px; }
.operations-summary article { padding: 17px; background: #17253c; border: 1px solid #263b5a; border-radius: 8px; }
.operations-summary span,
.operations-summary strong,
.operations-summary small { display: block; }
.operations-summary span { color: #7e90ac; font-size: 9px; }
.operations-summary strong { margin: 7px 0 4px; color: #fff; font-size: 20px; }
.operations-summary small { color: #91a0b6; font-size: 9px; }
.operations-main { align-items: start; margin-bottom: 16px; }
.formula-box { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 16px; color: #647188; background: #f4f7fb; border: 1px solid #e2e8f0; border-radius: 7px; font-size: 10px; }
.formula-box span { padding: 6px 7px; background: #fff; border-radius: 4px; }
.formula-box b { color: #9aa5b5; }
.formula-box strong { color: #3267e3; }
.rule-table { margin-top: 14px; border: 1px solid #e4e9f0; border-radius: 7px; }
.rule-table > div { display: grid; grid-template-columns: 1fr 1.5fr .7fr; padding: 10px 12px; border-bottom: 1px solid #edf0f4; font-size: 10px; }
.rule-table > div:last-child { border-bottom: 0; }
.rule-table .head { color: #fff; background: #22304a; border-radius: 6px 6px 0 0; }
.rule-table strong { color: #2b384e; }
.rule-table span { color: #748095; }
.rule-table b { color: #3267e3; text-align: right; }
.rule-note { margin: 12px 0 0; color: #8b630e; font-size: 9px; }
.checklist-panel .enterprise-panel-head > b { color: #3267e3; font-size: 18px; }
.completion-line { height: 7px; margin-bottom: 13px; overflow: hidden; background: #e8edf4; border-radius: 99px; }
.completion-line span { display: block; height: 100%; background: #3267e3; transition: .2s; }
.check-item { display: grid; grid-template-columns: 55px 1fr; align-items: center; gap: 10px; width: 100%; padding: 11px; text-align: left; background: #fff; border: 1px solid #e5eaf1; border-radius: 6px; margin-bottom: 7px; }
.check-item:hover { transform: none; }
.check-item.done { background: #f1f8f5; border-color: #d6ebe3; }
.check-box { padding: 5px; color: #8b96a7; background: #edf0f4; border-radius: 4px; font-size: 8px; text-align: center; }
.check-item.done .check-box { color: #167457; background: #daf0e8; }
.check-item strong { color: #334157; font-size: 10px; }
.operator-note { margin-top: 13px; padding: 13px; background: #fff8e8; border: 1px solid #eddfbd; border-radius: 6px; }
.operator-note span { color: #91702d; font-size: 8px; font-weight: 900; }
.operator-note p { margin: 5px 0 0; color: #685a3d; font-size: 10px; line-height: 1.5; }
.log-panel button { padding: 7px 9px; color: #3267e3; background: #edf3ff; border: 1px solid #d7e3fc; border-radius: 5px; font-size: 9px; }
.log-head,
.log-row { display: grid; grid-template-columns: 70px 70px 80px 1fr 80px; align-items: center; gap: 10px; }
.log-head { padding: 9px 12px; color: #fff; background: #22304a; border-radius: 6px 6px 0 0; font-size: 9px; font-weight: 800; }
.log-row { padding: 11px 12px; border-bottom: 1px solid #edf0f4; color: #68758a; font-size: 10px; }
.log-row b,
.log-row strong { color: #2b394f; }
.log-row em { color: #188060; font-style: normal; font-size: 9px; }
.log-level { width: 42px; padding: 4px; border-radius: 4px; text-align: center; font-size: 8px; font-weight: 800; }
.log-level.정상 { color: #167457; background: #e3f4ed; }
.log-level.주의 { color: #8a5b1c; background: #fff0d8; }
.log-level.위험 { color: #9c3039; background: #fce5e7; }
@media (max-width: 800px) {
  .operations-summary { grid-template-columns: 1fr 1fr; }
  .log-panel { overflow-x: auto; }
  .log-head, .log-row { min-width: 680px; }
}
</style>
