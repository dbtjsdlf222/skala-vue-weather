<script setup>
import { computed } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { ElSwitch } from 'element-plus'
import '@/assets/assignment.css'

const route = useRoute()
const router = useRouter()

// 사이드바 메뉴를 한곳에서 관리한다.
const menus = [
  { to: '/ballcast/dashboard', code: 'OV', label: '통합 대시보드', description: '오늘 경기 요약' },
  { to: '/ballcast/schedule', code: 'SC', label: '경기 일정', description: '전체 일정과 위험도' },
  { to: '/ballcast/stadiums', code: 'ST', label: '구장 날씨', description: '구장별 기상 비교' },
  { to: '/ballcast/records', code: 'TR', label: '팀 기록', description: '순위와 전력 비교' },
  { to: '/ballcast/operations', code: 'OP', label: '운영 관리', description: '판단 기준과 로그' },
]

const pageTitle = computed(() => route.meta.title || '통합 대시보드')
const today = new Date().toLocaleDateString('ko-KR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'short',
})

const goPractice = () => {
  router.push('/')
}
</script>

<template>
  <div class="enterprise-layout">
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-mark">BC</div>
        <div>
          <strong>BALLCAST</strong>
          <span>WEATHER OPERATIONS</span>
        </div>
      </div>

      <div class="menu-label">OPERATIONS MENU</div>
      <nav class="side-menu">
        <RouterLink v-for="menu in menus" :key="menu.to" :to="menu.to">
          <span class="menu-code">{{ menu.code }}</span>
          <span class="menu-copy">
            <strong>{{ menu.label }}</strong>
            <small>{{ menu.description }}</small>
          </span>
        </RouterLink>
      </nav>

      <div class="system-card">
        <span class="system-dot"></span>
        <div>
          <strong>운영 시스템 정상</strong>
          <small>5개 구장 연결됨</small>
        </div>
      </div>
    </aside>

    <div class="workspace">
      <header class="topbar">
        <div>
          <span class="breadcrumb">BALLCAST / OPERATIONS</span>
          <h1>{{ pageTitle }}</h1>
        </div>

        <div class="topbar-right">
          <div class="today-box">
            <span>운영 기준일</span>
            <strong>{{ today }}</strong>
          </div>
          <div class="mode-control">
            <span>Vue 문법 실습</span>
            <el-switch :model-value="true" @change="goPractice" />
            <b>과제</b>
          </div>
        </div>
      </header>

      <div class="router-content">
        <RouterView />
      </div>

      <footer class="workspace-footer">
        <strong>BALLCAST OPERATIONS</strong>
        <span>취소 확률은 공식 경기 취소 발표가 아닌 실습용 참고 지표입니다.</span>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.enterprise-layout {
  display: grid;
  grid-template-columns: 245px minmax(0, 1fr);
  min-height: 100vh;
  color: #1b273b;
  background: #f2f5f9;
  font-family: Pretendard, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.sidebar {
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 24px 18px;
  color: #ffffff;
  background: #101b2d;
  border-right: 1px solid #243249;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 7px 27px;
  border-bottom: 1px solid #27354a;
}

.brand-mark {
  display: grid;
  place-items: center;
  width: 39px;
  height: 39px;
  background: #3267e3;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 900;
}

.brand strong,
.brand span {
  display: block;
}

.brand strong {
  font-size: 15px;
  letter-spacing: 0.08em;
}

.brand span {
  margin-top: 3px;
  color: #7788a2;
  font-size: 8px;
  letter-spacing: 0.12em;
}

.menu-label {
  margin: 25px 10px 10px;
  color: #60708a;
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 0.13em;
}

.side-menu {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.side-menu a {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 11px;
  color: #91a0b7;
  border: 1px solid transparent;
  border-radius: 8px;
  text-decoration: none;
}

.side-menu a:hover,
.side-menu a.router-link-active {
  color: #ffffff;
  background: #1a2a44;
  border-color: #2a3c5a;
}

.side-menu a.router-link-active {
  box-shadow: inset 3px 0 #4d7df0;
}

.menu-code {
  display: grid;
  flex: 0 0 32px;
  place-items: center;
  width: 32px;
  height: 32px;
  color: #8da5ce;
  background: #22324c;
  border-radius: 6px;
  font-size: 9px;
  font-weight: 900;
}

.menu-copy strong,
.menu-copy small {
  display: block;
}

.menu-copy strong {
  font-size: 12px;
}

.menu-copy small {
  margin-top: 3px;
  color: #697a94;
  font-size: 9px;
}

.system-card {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: auto;
  padding: 13px;
  background: #17263d;
  border: 1px solid #263954;
  border-radius: 8px;
}

.system-card strong,
.system-card small {
  display: block;
}

.system-card strong {
  font-size: 10px;
}

.system-card small {
  margin-top: 3px;
  color: #71829c;
  font-size: 9px;
}

.system-dot {
  width: 8px;
  height: 8px;
  background: #35b68d;
  border-radius: 50%;
  box-shadow: 0 0 0 4px rgba(53, 182, 141, 0.13);
}

.workspace {
  display: flex;
  min-width: 0;
  min-height: 100vh;
  flex-direction: column;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 78px;
  padding: 0 30px;
  background: #ffffff;
  border-bottom: 1px solid #dde4ed;
}

.breadcrumb {
  color: #7f8da2;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.1em;
}

.topbar h1 {
  margin: 4px 0 0;
  color: #172337;
  font-size: 20px;
}

.topbar-right,
.mode-control {
  display: flex;
  align-items: center;
}

.topbar-right {
  gap: 25px;
}

.today-box {
  padding-right: 25px;
  border-right: 1px solid #e0e5ec;
}

.today-box span,
.today-box strong {
  display: block;
  text-align: right;
}

.today-box span {
  color: #8a96a8;
  font-size: 9px;
}

.today-box strong {
  margin-top: 3px;
  color: #354157;
  font-size: 11px;
}

.mode-control {
  gap: 8px;
  font-size: 10px;
}

.mode-control span {
  color: #8b96a8;
}

.mode-control b {
  color: #26344a;
}

.router-content {
  flex: 1;
}

.workspace-footer {
  display: flex;
  justify-content: space-between;
  padding: 18px 30px;
  color: #7f8b9d;
  background: #ffffff;
  border-top: 1px solid #e0e6ee;
  font-size: 9px;
}

.workspace-footer strong {
  color: #334056;
  letter-spacing: 0.08em;
}

@media (max-width: 900px) {
  .enterprise-layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: static;
    height: auto;
    padding: 12px;
  }

  .brand,
  .menu-label,
  .system-card,
  .menu-copy small {
    display: none;
  }

  .side-menu {
    flex-direction: row;
    overflow-x: auto;
  }

  .side-menu a {
    flex: 0 0 auto;
  }
}

@media (max-width: 600px) {
  .topbar {
    min-height: 68px;
    padding: 0 14px;
  }

  .today-box,
  .mode-control span {
    display: none;
  }

  .workspace-footer {
    align-items: flex-start;
    flex-direction: column;
    gap: 5px;
    padding: 15px;
  }
}
</style>
