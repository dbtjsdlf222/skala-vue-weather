// ref는 단위 상태를 저장하고, computed는 단위 기호를 계산합니다.
import { ref, computed } from 'vue'
// defineStore는 Pinia Store를 만드는 함수입니다.
import { defineStore } from 'pinia'

// 'config'라는 이름의 Store를 만들고 다른 파일에서 사용할 수 있게 내보냅니다.
export const useConfigStore = defineStore('config', () => {
  // 1. state: 단위를 저장하는 변수 (초기값은 'celsius')
  // 값은 오직 'celsius' 또는 'fahrenheit' 두 가지만 가집니다.
  const unit = ref('celsius')

  // 화면의 밝은 테마와 어두운 테마 상태를 저장합니다.
  const darkMode = ref(false)

  // 사용자가 마지막으로 선택한 도시 이름을 저장합니다.
  const selectedCity = ref('서울')

  // 2. getters: 현재 단위 상태에 맞춰 화면에 뿌릴 기호(℃ / ℉)를 실시간 리턴
  const unitSymbol = computed(() => {
    return unit.value === 'celsius' ? '℃' : '℉'
  })

  // 3. actions: 버튼 클릭 시 'celsius'와 'fahrenheit'를 토글(스위칭)하는 함수
  function toggleUnit() {
    unit.value = unit.value === 'celsius' ? 'fahrenheit' : 'celsius'
  }

  // 버튼을 누를 때마다 true와 false를 반대로 변경합니다.
  function toggleDarkMode() {
    darkMode.value = !darkMode.value
  }

  // Store 화면에서 누른 도시 이름을 전역 상태에 저장합니다.
  function selectCity(cityName) {
    selectedCity.value = cityName
  }

  // 컴포넌트에서 사용할 상태, 계산값, 함수를 밖으로 공개합니다.
  return {
    unit,
    darkMode,
    selectedCity,
    unitSymbol,
    toggleUnit,
    toggleDarkMode,
    selectCity,
  }
})
