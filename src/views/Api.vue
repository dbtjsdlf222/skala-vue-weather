<script setup>
// ref는 변경되는 값을 저장하고, computed는 기존 값으로 새로운 결과를 계산합니다.
// watch는 선택한 지역이 바뀌는 순간 API 요청 함수를 실행합니다.
import { computed, ref, watch } from 'vue'

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
// 현재 선택한 지역을 저장합니다. 첫 화면에서는 서울을 선택합니다.
const selectedRegion = ref(regionList[0])
// API에서 받은 날씨 정보를 저장합니다. 아직 받지 않았으므로 null입니다.
const weather = ref(null)
// API 요청 중인지 저장합니다.
const loading = ref(false)
// API 요청이 실패했을 때 보여줄 메시지를 저장합니다.
const errorMessage = ref('')

// 검색어가 바뀔 때마다 조건에 맞는 지역 목록을 자동으로 다시 계산합니다.
const searchResult = computed(() => {
  // filter는 조건이 true인 지역만 모아 새로운 배열을 만듭니다.
  return regionList.filter((region) => {
    // 짧은 이름 또는 전체 지역명에 검색어가 포함되어 있는지 확인합니다.
    return region.name.includes(searchText.value) || region.location.includes(searchText.value)
  })
})

// 검색어만 지우면 computed가 전체 지역 목록을 자동으로 다시 계산합니다.
const resetSearch = () => {
  searchText.value = ''
}

// API가 숫자로 보내는 날씨 코드를 한글 상태로 바꿉니다.
const getWeatherStatus = (code) => {
  if (code === 0) { return '맑음' }
  if (code <= 3)  { return '구름' }
  if (code <= 67) { return '비'  }
  if (code <= 77) { return '눈'  }
  return '흐림'
}

// 선택한 지역의 현재 날씨를 Open-Meteo API에서 가져옵니다.
const getWeather = async (region) => {
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
  } finally {
    // 성공과 실패에 관계없이 요청이 끝나면 로딩을 끕니다.
    loading.value = false
  }
}

// selectedRegion이 바뀔 때마다 해당 지역의 날씨를 자동으로 요청합니다.
// immediate: true 때문에 화면에 처음 들어왔을 때도 서울 날씨를 바로 요청합니다.
watch(
  selectedRegion,
  (newRegion) => {
    getWeather(newRegion)
  },
  { immediate: true },
)
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
          <!-- v-model이 입력창과 searchText를 양방향으로 연결합니다. -->
          <input v-model="searchText" type="text" placeholder="예: 서울, 경기도, 제주" />

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
            :class="{ selected: selectedRegion.id === region.id }"
            @click="selectedRegion = region"
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
