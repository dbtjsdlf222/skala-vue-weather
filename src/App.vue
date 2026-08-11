<script setup>
// RouterLink는 메뉴 이동에, RouterView는 현재 주소의 화면 출력에 사용합니다.
import { RouterLink, RouterView } from 'vue-router'
// Pinia의 다크 모드 상태를 전체 화면에 적용하기 위해 Store를 불러옵니다.
import { useConfigStore } from './stores/configStore'

// configStore.darkMode 값은 5번 화면의 버튼으로 변경됩니다.
const configStore = useConfigStore()
</script>

<template>
  <!-- 모든 화면에서 공통으로 보이는 최상위 영역입니다. -->
  <div class="app-container" :class="{ 'dark-mode': configStore.darkMode }">
    <header class="app-header">
      <span class="eyebrow">VUE 3 LEARNING PROJECT</span>
      <h1>⛅ SKALA 날씨 연구소</h1>
      <p>기초 문법부터 실제 API까지 단계별로 개선한 날씨 대시보드입니다.</p>
    </header>

    <!-- RouterLink를 누르면 페이지 새로고침 없이 주소와 화면이 변경됩니다. -->
    <nav class="navigation-bar">
      <RouterLink to="/basic" class="nav-item">1. 기본</RouterLink>
      <RouterLink to="/search" class="nav-item">2. 검색</RouterLink>
      <RouterLink to="/component" class="nav-item">3. 컴포넌트</RouterLink>
      <RouterLink to="/router" class="nav-item">4. Router</RouterLink>
      <RouterLink to="/store" class="nav-item">5. Store</RouterLink>
      <RouterLink to="/api" class="nav-item">6. API</RouterLink>
    </nav>

    <!-- 선택한 주소에 연결된 View 컴포넌트가 이 자리에 표시됩니다. -->
    <main>
      <RouterView />
    </main>
  </div>
</template>

<style>
/* 모든 과제 화면에서 함께 사용할 CSS 파일을 가져옵니다. */
@import '@/assets/exercise.css';
</style>
