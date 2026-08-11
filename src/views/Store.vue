<script setup>
// Pinia에 만든 설정 Store를 불러옵니다.
import { useConfigStore } from '../stores/configStore'
// 단위 변경 버튼을 가진 컴포넌트를 불러옵니다.
import UnitToggler from '../components/weather/UnitToggler.vue'

// Store를 사용하기 위한 객체를 만듭니다.
const configStore = useConfigStore()

// 화면에 출력할 날씨 배열입니다.
const weatherList = [
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
]

// 섭씨 값을 현재 Store의 단위에 맞게 반환합니다.
function changeTemperature(celsius) {
  // Store의 단위가 섭씨라면 받은 값을 그대로 반환합니다.
  if (configStore.unit === 'celsius') {
    return celsius
  }

  // 화씨를 선택했다면 섭씨를 화씨로 계산한 뒤 반올림합니다.
  return Math.round((celsius * 9) / 5 + 32)
}
</script>

<template>
  <!-- 5번 Pinia 학습 화면입니다. -->
  <section>
    <h2>5. Pinia 상태 관리</h2>
    <p>단위 상태를 Pinia Store에 저장하고 모든 날씨 카드에 적용합니다.</p>

    <div class="store-toolbar">
      <!-- 버튼을 누르면 Pinia Store의 단위가 변경됩니다. -->
      <UnitToggler />
    </div>

    <div class="store-summary">
      현재 선택 도시: <strong>{{ configStore.selectedCity }}</strong>
    </div>

    <!-- 배열의 각 도시를 현재 단위에 맞춰 출력합니다. -->
    <div
      v-for="weather in weatherList"
      :key="weather.id"
      class="weather-card"
      :class="{ selected: configStore.selectedCity === weather.name }"
      @click="configStore.selectCity(weather.name)"
    >
      <h3>{{ weather.name }} ({{ weather.status }})</h3>
      <p>
        현재 기온: {{ changeTemperature(weather.temp) }}{{ configStore.unitSymbol }}
      </p>
    </div>
  </section>
</template>
