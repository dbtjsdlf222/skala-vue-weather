<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { ElButton, ElInput, ElInputNumber, ElMessage, ElMessageBox } from 'element-plus'
import { api2Data } from '@/data/data.js'

// .env.local에 저장한 OpenWeatherMap API 키를 가져온다.
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather'
const STATION_URL = '/openweather-stations'

const isLoading = ref(false)
const message = ref('Axios 요청')
const weatherData = ref(null)
const stations = ref([])
const selectedId = ref('')
const selectedSample = ref(1)

// POST와 PUT에서 사용할 측정소 정보
const form = ref({
  external_id: 'SKALA_JEJU_' + Date.now().toString().slice(-6),
  name: '제주 날씨 측정소',
  latitude: 33.4996,
  longitude: 126.5312,
  altitude: 10,
})

// OpenWeatherMap에 전달할 측정소 객체를 만든다.
const getStationData = () => {
  return {
    external_id: form.value.external_id,
    name: form.value.name,
    latitude: Number(form.value.latitude),
    longitude: Number(form.value.longitude),
    altitude: Number(form.value.altitude),
  }
}

// 샘플 데이터를 누르면 입력칸에 값을 넣는다.
const selectSample = (sample) => {
  selectedSample.value = sample.id
  selectedId.value = ''

  form.value = {
    external_id: sample.external_id + '_' + Date.now().toString().slice(-6),
    name: sample.name,
    latitude: sample.latitude,
    longitude: sample.longitude,
    altitude: sample.altitude,
  }

  message.value = `${sample.title}를 선택했습니다.`
}

// GET: 입력한 위도와 경도의 현재 날씨를 조회한다.
const getWeather = async () => {
  isLoading.value = true

  try {
    const response = await axios.get(WEATHER_URL, {
      params: {
        lat: form.value.latitude,
        lon: form.value.longitude,
        appid: API_KEY,
        units: 'metric',
        lang: 'kr',
      },
    })

    weatherData.value = response.data
    message.value = `GET 성공: HTTP ${response.status}`
    ElMessage.success(message.value)
  } catch (error) {
    handleError(error)
  } finally {
    isLoading.value = false
  }
}

// POST: 새로운 개인 날씨 측정소를 등록한다.
const createStation = async () => {
  isLoading.value = true

  try {
    const response = await axios.post(STATION_URL, getStationData(), {
      params: { appid: API_KEY },
    })

    selectedId.value = response.data.ID
    await getStations(false)
    message.value = `POST 성공: HTTP ${response.status}`
    ElMessage.success(message.value)
  } catch (error) {
    handleError(error)
  } finally {
    isLoading.value = false
  }
}

// GET: 내 계정에 등록된 측정소 목록을 조회한다.
const getStations = async (showMessage = true) => {
  isLoading.value = true

  try {
    const response = await axios.get(STATION_URL, {
      params: { appid: API_KEY },
    })

    stations.value = response.data
    if (showMessage) {
      message.value = `GET 목록 성공: HTTP ${response.status}, ${stations.value.length}개`
      ElMessage.success(message.value)
    }
  } catch (error) {
    handleError(error)
  } finally {
    isLoading.value = false
  }
}

// PUT: 목록에서 선택한 측정소 정보를 수정한다.
const updateStation = async () => {
  if (!selectedId.value) {
    message.value = '먼저 목록에서 수정할 측정소를 선택하세요.'
    ElMessage.warning(message.value)
    return
  }

  isLoading.value = true

  try {
    const response = await axios.put(
      `${STATION_URL}/${selectedId.value}`,
      getStationData(),
      { params: { appid: API_KEY } },
    )

    await getStations(false)
    message.value = `PUT 성공: HTTP ${response.status}`
    ElMessage.success(message.value)
  } catch (error) {
    handleError(error)
  } finally {
    isLoading.value = false
  }
}

// DELETE: 목록에서 선택한 측정소를 삭제한다.
const deleteStation = async () => {
  if (!selectedId.value) {
    message.value = '먼저 목록에서 삭제할 측정소를 선택하세요.'
    ElMessage.warning(message.value)
    return
  }

  try {
    // 브라우저 confirm 대신 Element Plus 확인창을 사용한다.
    await ElMessageBox.confirm('선택한 측정소를 정말 삭제할까요?', '삭제 확인', {
      confirmButtonText: '삭제',
      cancelButtonText: '취소',
      type: 'warning',
    })
  } catch {
    return
  }

  isLoading.value = true

  try {
    const response = await axios.delete(`${STATION_URL}/${selectedId.value}`, {
      params: { appid: API_KEY },
    })

    selectedId.value = ''
    await getStations(false)
    message.value = `DELETE 성공: HTTP ${response.status}`
    ElMessage.success(message.value)
  } catch (error) {
    handleError(error)
  } finally {
    isLoading.value = false
  }
}

// 목록에서 측정소를 선택하면 해당 정보를 입력칸에 넣는다.
const selectStation = (station) => {
  selectedId.value = station.id
  form.value.external_id = station.external_id
  form.value.name = station.name
  form.value.latitude = station.latitude
  form.value.longitude = station.longitude
  form.value.altitude = station.altitude
  message.value = `${station.name} 측정소를 선택했습니다.`
}

const handleError = (error) => {
  message.value = `오류 발생 요청 실패`
  ElMessage.error(message.value)
  console.error(error)
}
</script>

<template>
  <section>
    <h2>7. API2 Axios CRUD</h2>
    <p>OpenWeatherMap 현재 날씨와 개인 측정소 API를 Axios로 요청합니다.</p>

    <div class="api2-layout">
      <div>
        <div class="api2-form">
          <label>
            외부 ID
            <el-input v-model="form.external_id" />
          </label>
          <label>
            측정소 이름
            <el-input v-model="form.name" />
          </label>
          <label>
            위도
            <el-input-number v-model="form.latitude" :precision="6" :controls="false" />
          </label>
          <label>
            경도
            <el-input-number v-model="form.longitude" :precision="6" :controls="false" />
          </label>
          <label>
            고도
            <el-input-number v-model="form.altitude" :controls="false" />
          </label>
        </div>
        <div class="api2-buttons">
          <el-button type="primary" :disabled="isLoading" @click="getWeather">GET 날씨</el-button>
          <el-button type="success" :disabled="isLoading" @click="createStation">POST 등록</el-button>
          <el-button :disabled="isLoading" @click="getStations">GET 목록</el-button>
          <el-button type="warning" :disabled="isLoading" @click="updateStation">PUT 수정</el-button>
          <el-button type="danger" :disabled="isLoading" @click="deleteStation">DELETE 삭제</el-button>
        </div>

        <p class="result">{{ isLoading ? '요청 중입니다.' : message }}</p>

        <div v-if="weatherData" class="api2-weather">
          <h3>현재 날씨 조회 결과</h3>
          <p>지역: {{ weatherData.name }}</p>
          <p>날씨: {{ weatherData.weather[0].description }}</p>
          <p>기온: {{ weatherData.main.temp }}도</p>
          <p>습도: {{ weatherData.main.humidity }}%</p>
        </div>

        <div class="api2-list">
          <h3>등록된 측정소 목록</h3>
          <p v-if="stations.length === 0">GET 목록 버튼을 눌러 조회하세요.</p>

          <button
            v-for="station in stations"
            :key="station.id"
            class="station-item"
            :class="{ selected: selectedId === station.id }"
            @click="selectStation(station)"
          >
            <strong>{{ station.name }}</strong>
            <span>{{ station.external_id }}</span>
          </button>
        </div>
      </div>

      <aside class="api2-aside">
        <h3>샘플 데이터</h3>
        <p>하나를 선택하세요.</p>

        <button
          v-for="sample in api2Data"
          :key="sample.id"
          :class="{ selected: selectedSample === sample.id }"
          @click="selectSample(sample)"
        >
          <strong>{{ sample.title }}</strong>
          <span>{{ sample.name }}</span>
        </button>
      </aside>
    </div>
  </section>
</template>

<style scoped>
.api2-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 210px;
  gap: 18px;
  align-items: start;
}

.api2-form {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-top: 20px;
}

.api2-form label {
  color: #6f7c91;
  font-size: 13px;
  font-weight: bold;
}

.api2-form .el-input,
.api2-form .el-input-number {
  width: 100%;
  margin-top: 5px;
}

.api2-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 16px 0;
}

.api2-weather,
.api2-list {
  margin-top: 16px;
  padding: 16px;
  background: #f5f7fb;
  border-radius: 12px;
}

.api2-weather h3,
.api2-list h3 {
  margin-top: 0;
}

.api2-weather p {
  margin: 5px 0;
}

.station-item {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 7px;
}

.station-item.selected {
  color: white;
  background: #5b5bd6;
}

.api2-aside {
  margin-top: 20px;
  padding: 14px;
  background: #f5f7fb;
  border-radius: 12px;
}

.api2-aside h3 {
  margin: 0;
}

.api2-aside p {
  margin: 5px 0 12px;
  color: #6f7c91;
  font-size: 12px;
}

.api2-aside button {
  display: flex;
  flex-direction: column;
  gap: 3px;
  width: 100%;
  margin-top: 7px;
  text-align: left;
}

.api2-aside button span {
  color: #6f7c91;
  font-size: 11px;
}

.api2-aside button.selected {
  color: white;
  background: #5b5bd6;
}

.api2-aside button.selected span {
  color: white;
}

@media (max-width: 600px) {
  .api2-layout,
  .api2-form {
    grid-template-columns: 1fr;
  }

  .api2-aside {
    order: -1;
  }
}
</style>
