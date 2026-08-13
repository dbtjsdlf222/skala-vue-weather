<script setup>
import { useConfigStore } from '../../stores/configStore'
import UnitToggler from '../../components/weather/UnitToggler.vue'
import { cityList } from '@/data/data.js'

const store = useConfigStore()

// 섭씨를 선택하면 원래 온도, 화씨를 선택하면 변환한 온도를 반환한다.
const getTemp = (value) => {
  if (store.unit === 'celsius') return value
  return Math.round((value * 9) / 5 + 32)
}
</script>

<template>
  <section>
    <h2>5. Pinia 상태 관리</h2>
    <p>단위 상태를 Pinia Store에 저장하고 모든 날씨 카드에 적용합니다.</p>

    <div class="store-con">
      <UnitToggler />
    </div>

    <div class="store-info">
      현재 선택 도시: <strong>{{ store.selectedCity }}</strong>
    </div>

    <div
      v-for="item in cityList"
      :key="item.id"
      class="card"
      :class="{ selected: store.selectedCity === item.name }"
      @click="store.selectCity(item.name)"
    >
      <h3>{{ item.name }} ({{ item.status }})</h3>
      <!-- 선택한 단위 이름을 온도 앞에 표시한다. -->
      <p>
        현재 기온:
        {{ store.unit === 'celsius' ? '섭씨' : '화씨' }}
        {{ getTemp(item.temp) }}
      </p>
    </div>
  </section>
</template>
