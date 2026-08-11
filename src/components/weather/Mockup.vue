<script setup>
// ref는 값이 바뀌면 Vue가 화면을 다시 그릴 수 있게 합니다.
import { ref } from 'vue'

// 화면에 반복 출력할 연습용 날씨 배열입니다.
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
])

// 입력창의 검색어를 저장합니다.
const searchQuery = ref('')
// 사용자가 선택한 도시 안내 문구를 저장합니다.
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')
// 현재 선택한 카드의 도시 이름을 저장합니다.
const selectedCityName = ref('')

// 카드를 누르면 선택한 도시 이름과 안내 문구를 함께 변경합니다.
function selectCity(item) {
  selectedCityName.value = item.name
  selectedCityInfo.value = `${item.name}이 선택되었습니다.`
}

// +와 - 버튼에서 전달한 숫자만큼 온도를 변경합니다.
function changeTemperature(item, amount) {
  item.temp = item.temp + amount
}

// 날씨 상태에 맞는 아이콘을 반환합니다.
function getWeatherIcon(status) {
  if (status === '맑음') return '☀️'
  if (status === '비') return '🌧️'
  return '☁️'
}

// 상세보기 버튼을 누르면 브라우저 알림창을 띄웁니다.
const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}
</script>

<template>
  <!-- 1번 기본 날씨 화면의 전체 영역입니다. -->
  <div class="dashboard-wrapper">
    <section class="search-box">
      <h3>도시 검색</h3>
      <!-- 입력할 때 event 객체에서 현재 input 값을 가져옵니다. -->
      <input type="text" :value="searchQuery" @input="(e) => (searchQuery = e.target.value)" placeholder="검색할 도시 이름 입력" />
      <p>
        검색 중인 도시: <strong>{{ searchQuery }}</strong>
      </p>
    </section>

    <section class="list-box">
      <div class="section-title-row">
        <h3>지역별 날씨 현황</h3>
        <span class="count-chip">총 {{ weatherList.length }}개 도시</span>
      </div>

      <!-- weatherList의 데이터 개수만큼 날씨 카드를 반복해서 만듭니다. -->
      <div v-for="item in weatherList" :key="item.id" class="weather-card" :class="{ selected: selectedCityName === item.name }" @click="selectCity(item)">
        <div class="weather-main">
          <span class="weather-icon">{{ getWeatherIcon(item.status) }}</span>
          <div>
            <h4>{{ item.name }} ({{ item.status }})</h4>
            <p>현재 기온: {{ item.temp }}°C</p>
          </div>
        </div>

        <!-- v-if와 v-else로 온도에 맞는 배지 하나만 출력합니다. -->
        <span v-if="item.temp >= 25" class="badge hot">더움 (25도 이상)</span>
        <span v-else class="badge cool">추움 (25도 미만)</span>

        <!-- 온도 변경 버튼으로 배열 안 객체의 temp 값을 직접 변경합니다. -->
        <div class="temp-buttons">
          <button @click.stop="changeTemperature(item, -1)">- 1℃</button>
          <button @click.stop="changeTemperature(item, 1)">+ 1℃</button>
        </div>

        <!-- .stop은 버튼 클릭이 카드 클릭으로 이어지는 것을 막습니다. -->
        <button class="btn-detail" @click.stop="showDetail(item.name, item.status)">상세보기</button>
      </div>
    </section>

    <!-- 카드를 클릭하면 변경되는 안내 문구입니다. -->
    <div class="status-bar">
      {{ selectedCityInfo }}
    </div>
  </div>
</template>
