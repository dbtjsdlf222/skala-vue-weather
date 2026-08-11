<script setup>
// Pinia에 만든 설정 Store를 불러옵니다.
import { useConfigStore } from '@/stores/configStore'
// 템플릿에서 Store 상태와 함수를 사용하기 위한 객체입니다.
const configStore = useConfigStore()
</script>

<template>
  <!-- 현재 단위와 테마를 표시하고 변경 버튼을 제공하는 컴포넌트입니다. -->
  <div class="setting-buttons">
    <!-- 삼항 연산자로 Store의 단위에 맞는 한글 문구를 출력합니다. -->
    <span
      >날씨단위: <strong>{{ configStore.unit === 'celsius' ? '섭씨(℃)' : '화씨(℉)' }}</strong></span
    >
    <!-- 클릭하면 Store의 toggleUnit 함수가 실행됩니다. -->
    <button class="toggle-btn" @click="configStore.toggleUnit">단위변경</button>
    <!-- 다크 모드 상태에 따라 버튼 문구도 변경합니다. -->
    <button class="toggle-btn theme-btn" @click="configStore.toggleDarkMode">
      {{ configStore.darkMode ? '밝게 보기' : '어둡게 보기' }}
    </button>
  </div>
</template>

<style scoped>
/* 단위 변경 버튼에만 적용할 스타일입니다. */
.setting-buttons {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.toggle-btn {
  padding: 6px 10px;
  background-color: #4b6584;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.theme-btn {
  background-color: #6255d9;
}
</style>
