<script setup>
import { computed } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { ElSwitch } from 'element-plus'
import { useConfigStore } from './stores/configStore'

const store = useConfigStore()
const route = useRoute()
const router = useRouter()

// 현재 주소가 /ballcast로 시작하면 과제 화면으로 표시한다.
const isAssignmentMode = computed(() => route.path.startsWith('/ballcast'))

// 토글을 바꾸면 각 과제의 첫 화면으로 이동한다.
const changeMode = (value) => {
  router.push(value ? '/ballcast' : '/')
}
</script>

<template>
  <div v-if="!isAssignmentMode" class="app" :class="{ dark: store.darkMode }">
    <header class="head">
      <div class="mode-switch">
        <span :class="{ active: !isAssignmentMode }">Vue 문법 실습</span>
        <el-switch :model-value="isAssignmentMode" @change="changeMode" />
        <span :class="{ active: isAssignmentMode }">과제</span>
      </div>

      <span class="sub">VUE 3 LEARNING PROJECT</span>
      <h1>SKALA 날씨 연구소</h1>
      <p>기초 문법부터 실제 API까지 단계별로 개선한 날씨 대시보드입니다.</p>
    </header>


    <nav class="nav">
      <RouterLink to="/about" class="nav-btn">0. 소개</RouterLink>
      <RouterLink to="/" class="nav-btn">1. 기본</RouterLink>
      <RouterLink to="/search" class="nav-btn">2. 검색</RouterLink>
      <RouterLink to="/component" class="nav-btn">3. 컴포넌트</RouterLink>
      <RouterLink to="/router" class="nav-btn">4. Router</RouterLink>
      <RouterLink to="/store" class="nav-btn">5. Store</RouterLink>
      <RouterLink to="/api" class="nav-btn">6. API1</RouterLink>
      <RouterLink to="/api2" class="nav-btn">7. API2</RouterLink>
    </nav>

    <main>
      <RouterView />
    </main>
  </div>

  <div v-else class="assignment-shell">
    <RouterView />
  </div>
</template>

<style>

@import '@/assets/exercise.css';
</style>
