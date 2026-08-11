<script setup>
// ref는 검색어와 검색 결과가 바뀔 때 화면도 갱신되게 합니다.
import { ref } from 'vue'

// 사용자가 입력한 검색어를 저장합니다.
const searchText = ref('')
// 선택한 날씨 상태를 저장합니다. 처음에는 모든 상태를 보여줍니다.
const statusFilter = ref('전체')

// 검색할 원본 날씨 배열입니다.
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
])

// 화면에 출력할 검색 결과입니다. 처음에는 전체 배열을 보여줍니다.
const searchResult = ref(weatherList.value)

// 검색어 또는 날씨 상태가 바뀔 때 실행되는 함수입니다.
function searchWeather() {
  // 도시 이름과 날씨 상태가 모두 조건에 맞는 항목만 저장합니다.
  searchResult.value = weatherList.value.filter(function (weather) {
    const nameMatches = weather.name.includes(searchText.value)
    const statusMatches = statusFilter.value === '전체' || weather.status === statusFilter.value

    return nameMatches && statusMatches
  })
}

// 입력값을 지우고 전체 날씨를 다시 보여줍니다.
function resetSearch() {
  searchText.value = ''
  statusFilter.value = '전체'
  searchResult.value = weatherList.value
}
</script>

<template>
  <!-- 2번 검색 학습 화면입니다. -->
  <section>
    <h2>2. 도시 검색</h2>

    <div class="search-box">
      <div class="search-controls">
        <!-- 입력할 때마다 searchWeather가 실행되어 결과가 실시간 변경됩니다. -->
        <input v-model="searchText" type="text" placeholder="도시 이름을 입력하세요" @input="searchWeather" />

        <!-- 날씨 상태를 선택해 검색 결과를 한 번 더 분류합니다. -->
        <select v-model="statusFilter" @change="searchWeather">
          <option>전체</option>
          <option>맑음</option>
          <option>비</option>
          <option>구름</option>
        </select>
      </div>

      <div class="button-group">
        <button @click="resetSearch">초기화</button>
      </div>
    </div>

    <div class="result-summary">
      <strong>{{ searchResult.length }}</strong>개의 검색 결과가 있습니다.
    </div>

    <!-- searchResult 배열의 각 날씨를 반복해서 출력합니다. -->
    <div class="weather-grid">
      <div v-for="weather in searchResult" :key="weather.id" class="weather-card simple-card">
        <span class="mini-label">{{ weather.status }}</span>
        <h3>{{ weather.name }}</h3>
        <p class="temperature-text">{{ weather.temp }}℃</p>
      </div>
    </div>

    <!-- 검색 결과가 하나도 없을 때만 문구를 표시합니다. -->
    <p v-if="searchResult.length === 0" class="empty-message">검색 결과가 없습니다.</p>
  </section>
</template>
