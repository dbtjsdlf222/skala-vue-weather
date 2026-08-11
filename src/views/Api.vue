<script setup>
// ref는 값이 바뀌었을 때 Vue가 화면을 다시 그릴 수 있게 합니다.
// onMounted는 이 화면이 처음 나타난 직후 실행할 작업을 등록합니다.
import { ref, onMounted } from 'vue'

// 전국 17개 시·도입니다.
// 도 지역은 시·도청 소재지의 좌표를 사용합니다.
const regionList = [
  { id: 1, name: '서울', location: '서울특별시', latitude: 37.5665, longitude: 126.978 },
  { id: 2, name: '부산', location: '부산광역시', latitude: 35.1796, longitude: 129.0756 },
  { id: 3, name: '대구', location: '대구광역시', latitude: 35.8714, longitude: 128.6014 },
  { id: 4, name: '인천', location: '인천광역시', latitude: 37.4563, longitude: 126.7052 },
  { id: 5, name: '광주', location: '광주광역시', latitude: 35.1595, longitude: 126.8526 },
  { id: 6, name: '대전', location: '대전광역시', latitude: 36.3504, longitude: 127.3845 },
  { id: 7, name: '울산', location: '울산광역시', latitude: 35.5384, longitude: 129.3114 },
  { id: 8, name: '세종', location: '세종특별자치시', latitude: 36.48, longitude: 127.289 },
  { id: 9, name: '경기', location: '경기도 수원시', latitude: 37.2636, longitude: 127.0286 },
  { id: 10, name: '강원', location: '강원특별자치도 춘천시', latitude: 37.8813, longitude: 127.73 },
  { id: 11, name: '충북', location: '충청북도 청주시', latitude: 36.6424, longitude: 127.489 },
  { id: 12, name: '충남', location: '충청남도 홍성군', latitude: 36.6012, longitude: 126.6608 },
  { id: 13, name: '전북', location: '전북특별자치도 전주시', latitude: 35.8242, longitude: 127.148 },
  { id: 14, name: '전남', location: '전라남도 무안군', latitude: 34.9904, longitude: 126.4817 },
  { id: 15, name: '경북', location: '경상북도 안동시', latitude: 36.5684, longitude: 128.7294 },
  { id: 16, name: '경남', location: '경상남도 창원시', latitude: 35.2279, longitude: 128.6811 },
  { id: 17, name: '제주', location: '제주특별자치도 제주시', latitude: 33.4996, longitude: 126.5312 },
]

// 입력창에 작성한 검색어를 저장합니다.
const searchText = ref('')
// 검색 조건에 맞는 지역만 저장합니다. 처음에는 전체 지역을 넣습니다.
const searchResult = ref(regionList)
// API에서 받은 날씨 정보를 저장합니다. 아직 받지 않았으므로 null입니다.
const weather = ref(null)
// API 요청 중인지 저장합니다.
const loading = ref(false)
// API 요청이 실패했을 때 보여줄 메시지를 저장합니다.
const errorMessage = ref('')

// input 이벤트 객체를 받아 입력할 때마다 지역을 검색합니다.
function searchRegion(event) {
  // event.target.value는 input에 현재 입력된 글자입니다.
  searchText.value = event.target.value

  // filter는 조건이 true인 지역만 모아 새로운 배열을 만듭니다.
  searchResult.value = regionList.filter(function (region) {
    // 짧은 이름 또는 전체 지역명에 검색어가 포함되어 있는지 확인합니다.
    return region.name.includes(searchText.value) || region.location.includes(searchText.value)
  })
}

// 검색어를 지우고 전국 17개 지역을 다시 보여줍니다.
function resetSearch() {
  searchText.value = ''
  searchResult.value = regionList
}

// API가 숫자로 보내는 날씨 코드를 한글 상태로 바꿉니다.
function getWeatherStatus(code) {
  if (code === 0) { return '맑음' }
  if (code <= 3)  { return '구름' }
  if (code <= 67) { return '비'  }
  if (code <= 77) { return '눈'  }
  return '흐림'
}

// 선택한 지역의 현재 날씨를 Open-Meteo API에서 가져옵니다.
async function getWeather(region) {
  // 요청이 시작되었으므로 로딩을 켜고 이전 오류 메시지를 지웁니다.
  loading.value = true
  errorMessage.value = ''

  // 선택한 지역의 위도와 경도를 API 주소에 연결합니다.
  const url =
    'https://api.open-meteo.com/v1/forecast' +
    '?latitude=' +
    region.latitude +
    '&longitude=' +
    region.longitude +
    '&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m' +
    '&timezone=Asia%2FSeoul'

  try {
    // fetch로 서버에 GET 요청을 보내고 응답을 기다립니다.
    const response = await fetch(url)

    // 서버 응답이 정상이 아니면 catch 부분으로 이동시킵니다.
    if (!response.ok) {
      throw new Error('API 요청 실패')
    }

    // JSON 형식의 응답을 JavaScript 객체로 변환합니다.
    const data = await response.json()

    // 화면에 필요한 값만 weather에 저장합니다.
    weather.value = {
      name: region.name,
      location: region.location,
      temperature: data.current.temperature_2m,
      humidity: data.current.relative_humidity_2m,
      windSpeed: data.current.wind_speed_10m,
      status: getWeatherStatus(data.current.weather_code),
    }
  } catch (error) {
    // 인터넷 또는 API에 문제가 생기면 오류 메시지를 저장합니다.
    errorMessage.value = '날씨 정보를 가져오지 못했습니다.'
    console.log(error)
  }
  // 성공과 실패에 관계없이 요청이 끝났으므로 로딩을 끕니다.
  loading.value = false
}

// 6번 화면이 처음 열리면 서울 날씨를 자동으로 조회합니다.
onMounted(function () {
  getWeather(regionList[0])
})
</script>

<template>
  <!-- 6번 API 학습 화면입니다. -->
  <section>
    <h2>6. 전국 날씨 API</h2>
    <p>지역을 검색한 뒤 카드를 누르면 현재 날씨를 가져옵니다.</p>

    <!-- 화면을 왼쪽 지역 목록과 오른쪽 날씨 정보로 나눕니다. -->
    <div class="api-layout">
      <div class="api-left-panel">
        <div class="search-box compact-search">
          <!-- 입력할 때마다 searchRegion 함수가 실행됩니다. -->
          <input :value="searchText" type="text" placeholder="예: 서울, 경기도, 제주" @input="searchRegion" />

          <div class="button-group">
            <!-- 클릭하면 검색어와 검색 결과를 초기 상태로 되돌립니다. -->
            <button @click="resetSearch">초기화</button>
          </div>
        </div>

        <div class="section-title-row">
          <h3>지역 선택</h3>
          <span class="count-chip">{{ searchResult.length }}개</span>
        </div>

        <!-- 검색된 지역 수만큼 작은 버튼을 반복해서 만듭니다. -->
        <div class="region-list compact-region-list">
          <button
            v-for="region in searchResult"
            :key="region.id"
            class="region-card compact-region-card"
            :class="{ selected: weather && weather.name === region.name }"
            @click="getWeather(region)"
          >
            <strong>{{ region.name }}</strong>
            <span>{{ region.location }}</span>
          </button>
        </div>

        <!-- 검색 결과 배열이 비어 있을 때만 표시합니다. -->
        <p v-if="searchResult.length === 0" class="empty-message">검색 결과가 없습니다.</p>
      </div>

      <!-- 선택한 지역의 날씨는 오른쪽 패널에 표시합니다. -->
      <aside class="api-right-panel">
        <!-- API 요청 중에는 로딩 문구를 표시합니다. -->
        <p v-if="loading" class="loading-message">날씨를 불러오는 중입니다.</p>

        <!-- 로딩이 끝났지만 오류가 있으면 오류 문구를 표시합니다. -->
        <p v-else-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </p>

        <!-- 정상적으로 받은 weather 값이 있을 때 날씨 정보를 작은 칸으로 나눕니다. -->
        <div v-else-if="weather" class="api-card">
          <div class="api-weather-header">
            <div>
              <span class="eyebrow api-eyebrow">CURRENT WEATHER</span>
              <h3>{{ weather.name }}</h3>
              <p>{{ weather.location }}</p>
            </div>
            <span class="weather-status">{{ weather.status }}</span>
          </div>

          <div class="weather-metric-list">
            <div class="weather-metric temperature-metric">
              <span>현재 기온</span>
              <strong>{{ weather.temperature }}℃</strong>
            </div>

            <div class="weather-metric">
              <span>습도</span>
              <strong>{{ weather.humidity }}%</strong>
            </div>

            <div class="weather-metric">
              <span>풍속</span>
              <strong>{{ weather.windSpeed }}km/h</strong>
            </div>

            <div class="weather-metric">
              <span>날씨 상태</span>
              <strong>{{ weather.status }}</strong>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </section>
</template>
