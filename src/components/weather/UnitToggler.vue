<script setup>
import { useConfigStore } from '@/stores/configStore'

const store = useConfigStore()
</script>

<template>
  <div class="btns">
    <span>날씨 단위: <strong>{{ store.unit === 'celsius' ? '섭씨' : '화씨' }}</strong></span>
    <button class="btn" @click="store.toggleUnit">단위 변경</button>
    <button class="btn theme" @click="store.toggleDarkMode">
      {{ store.darkMode ? '밝게 보기' : '어둡게 보기' }}
    </button>
  </div>
</template>

<style scoped>
.btns {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.btn {
  padding: 6px 10px;
  color: white;
  background: #4b6584;
  border: 0;
  border-radius: 4px;
  font-weight: bold;
}

.theme {
  background: #6255d9;
}
</style>
