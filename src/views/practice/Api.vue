<script setup>
import axios from 'axios'
import { computed, ref, watch } from 'vue'
import { regions } from '@/data/data.js'

const search = ref('')
const selected = ref(regions[0])
const weather = ref(null)
const loading = ref(false)
const error = ref('')

const result = computed(() => {
  return regions.filter((item) => {
    return item.name.includes(search.value) || item.location.includes(search.value)
  })
})

const reset = () => {
  search.value = ''
}

// 날씨에 따라 빨래 여부를 알려준다.
const laundry = computed(() => {
  if (!weather.value) return ''
  if (weather.value.rain >= 50) return '비추천'
  if (weather.value.humidity >= 75) return '보통'
  return '추천'
})

// 비와 바람으로 환기 가능 여부를 알려준다.
const ventilation = computed(() => {
  if (!weather.value) return ''
  if (weather.value.rain < 40 && weather.value.wind >= 3) return '가능'
  return '주의'
})

// 비와 기온으로 대청소 여부를 알려준다.
const cleaning = computed(() => {
  if (!weather.value) return ''
  if (weather.value.rain >= 60) return '비추천'
  if (weather.value.temp < 10 || weather.value.temp > 30) return '보통'
  return '추천'
})

// 기온과 습도로 불쾌지수를 계산한다.
const discomfort = computed(() => {
  if (!weather.value) return 0

  const temp = weather.value.temp
  const humidity = weather.value.humidity
  const value = 0.81 * temp + 0.01 * humidity * (0.99 * temp - 14.3) + 46.3

  return Math.round(value)
})


// 불쾌지수는 숫자 대신 짧은 상태로 표시한다.
const discomfortText = computed(() => {
  if (discomfort.value < 68) return '쾌적'
  if (discomfort.value < 75) return '보통'
  return '높음'
})

// 비, 기온, 불쾌지수로 집콕 추천 여부를 알려준다.
const stayHome = computed(() => {
  if (!weather.value) return ''

  if (weather.value.rain >= 60 || weather.value.temp > 33 || discomfort.value >= 80) {
    return '추천'
  }

  return '비추천'
})

// 추천 결과에 맞는 카드 색상을 반환한다.
const getCardColor = (type) => {
  if (!weather.value) return ''

  if (type === 'laundry') {
    if (weather.value.rain >= 50) return 'red-card'
    if (weather.value.humidity >= 75) return 'yellow-card'
    return 'green-card'
  }

  if (type === 'ventilation') {
    if (weather.value.rain < 40 && weather.value.wind >= 3) return 'green-card'
    return 'yellow-card'
  }

  if (type === 'cleaning') {
    if (weather.value.rain >= 60) return 'red-card'
    if (weather.value.temp < 10 || weather.value.temp > 30) return 'yellow-card'
    return 'green-card'
  }

  if (type === 'discomfort') {
    if (discomfort.value < 68) return 'green-card'
    if (discomfort.value < 75) return 'yellow-card'
    return 'red-card'
  }

  if (type === 'stayHome') {
    if (weather.value.rain >= 60 || weather.value.temp > 33 || discomfort.value >= 80) {
      return 'green-card'
    }
    return 'red-card'
  }

  return ''
}

const getStatus = (code) => {
  if (code === 0) return '맑음'
  if (code === 1) return '구름'
  if (code === 2) return '비'
  return '눈, 안개 등 기타'
}

const loadWeather = async (region) => {
  loading.value = true
  error.value = ''

  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${region.lat}` +
    `&longitude=${region.lon}` +
    '&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m' +
    '&daily=precipitation_probability_max&forecast_days=1' +
    '&timezone=Asia%2FSeoul'

  try {
    const response = await axios.get(url)
    const data = response.data
    const now = data.current

    weather.value = {
      name: region.name,
      location: region.location,
      temp: now.temperature_2m,
      humidity: now.relative_humidity_2m,
      wind: now.wind_speed_10m,
      rain: data.daily.precipitation_probability_max[0],
      status: getStatus(now.weather_code),
    }
  } catch (err) {
    error.value = '날씨 정보를 가져오지 못했습니다.'
    console.error(err)
  } finally {
    loading.value = false
  }
}

watch(selected, (region) => loadWeather(region), { immediate: true }) //  immediate: 페이지 로딩 시 즉시 로딩 
</script>

<template>
  <section>
    <h2>6. 전국 날씨 API</h2>
    <p>지역을 검색한 뒤 카드를 누르면 현재 날씨를 가져옵니다.</p>

    <div class="api-con">
      <div class="api-left">
        <div class="search-con small-search">
          <input v-model="search" type="text" placeholder="예: 서울, 경기도, 제주" />
          <div class="btns">
            <button @click="reset">초기화</button>
          </div>
        </div>

        <div class="title-row">
          <h3>지역 선택</h3>
          <span class="count">{{ result.length }}개</span>
        </div>

        <div class="region-grid small-grid">
          <button
            v-for="item in result"
            :key="item.id"
            class="region-btn small-btn"
            :class="{ selected: selected.id === item.id }"
            @click="selected = item"
          >
            <strong>{{ item.name }}</strong>
            <span>{{ item.location }}</span>
          </button>
        </div>

        <p v-if="result.length === 0" class="empty">검색 결과가 없습니다.</p>
      </div>

      <aside class="api-right">
        <p v-if="loading" class="loading">날씨를 불러오는 중입니다.</p>
        <p v-else-if="error" class="error">{{ error }}</p>

        <div v-else-if="weather" class="api-box">
          <div class="api-head">
            <div>
              <span class="sub api-sub">CURRENT WEATHER</span>
              <h3>{{ weather.name }}</h3>
              <p>{{ weather.location }}</p>
            </div>
            <span class="weather-state">{{ weather.status }}</span>
          </div>

          <div class="api-grid">
            <div class="api-item temp-item">
              <span>현재 기온</span>
              <strong>{{ weather.temp }}도</strong>
            </div>
            <div class="api-item">
              <span>습도</span>
              <strong>{{ weather.humidity }}%</strong>
            </div>
            <div class="api-item">
              <span>풍속</span>
              <strong>{{ weather.wind }} km/h</strong>
            </div>
            <div class="api-item">
              <span>날씨 상태</span>
              <strong>{{ weather.status }}</strong>
            </div>
            <div class="api-item">
              <span>강수 확률</span>
              <strong>{{ weather.rain }}%</strong>
            </div>
          </div>
        </div>
      </aside>
    </div>

    <div v-if="weather && !loading" class="list-con">
      <div class="title-row">
        <h3>유용한 정보</h3>
      </div>

      <div class="tip-list">
        <div class="tip-card" :class="getCardColor('laundry')">
          <strong>빨래</strong>
          <span>{{ laundry }}</span>
        </div>

        <div class="tip-card" :class="getCardColor('ventilation')">
          <strong>환기</strong>
          <span>{{ ventilation }}</span>
        </div>

        <div class="tip-card" :class="getCardColor('cleaning')">
          <strong>대청소</strong>
          <span>{{ cleaning }}</span>
        </div>

        <div class="tip-card" :class="getCardColor('discomfort')">
          <strong>불쾌지수 ({{ discomfort }})</strong>
          <span>{{ discomfortText }}</span>
        </div>

        <div class="tip-card" :class="getCardColor('stayHome')">
          <strong>집콕</strong>
          <span>{{ stayHome }}</span>
        </div>
      </div>
    </div>
  </section>
</template>
