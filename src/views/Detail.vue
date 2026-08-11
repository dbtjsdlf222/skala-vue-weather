<script setup>
// ref는 선택된 도시 정보를 반응형으로 저장합니다.
// onMounted는 상세 화면이 처음 나타난 뒤 실행됩니다.
import { ref, onMounted } from 'vue'
// useRoute는 현재 주소를 읽고, useRouter는 다른 주소로 이동할 때 사용합니다.
import { useRoute, useRouter } from 'vue-router'

// 현재 Route와 Router 객체를 변수에 저장합니다.
const route = useRoute()
const router = useRouter()

// 도시 ID별 상세 날씨를 가진 연습용 데이터입니다.
const mockDetails = {
  city_01: { name: '대한민국 서울특별시', temp: 28, status: '맑음', humidity: '55%', wind: '2.5m/s' },
  city_02: { name: '경기도 수원시 영통구', temp: 24, status: '비', humidity: '85%', wind: '4.1m/s' },
  city_03: { name: '부산광역시 해운대구', temp: 26, status: '구름', humidity: '65%', wind: '5.0m/s' },
}

// 이전과 다음 도시 이동 순서를 배열로 저장합니다.
const cityOrder = ['city_01', 'city_02', 'city_03']

// 주소의 cityId와 일치하는 도시 정보를 저장합니다.
const cityData = ref(null)

// 상세 화면이 열리면 주소에서 cityId를 읽습니다.
onMounted(() => {
  // /weather/city_01에서 city_01 부분을 가져옵니다.
  const id = route.params.cityId
  // 해당 ID의 데이터가 존재하면 화면에 사용할 변수에 저장합니다.
  if (mockDetails[id]) {
    cityData.value = mockDetails[id]
  }
})

// direction이 -1이면 이전, 1이면 다음 도시로 이동합니다.
function moveCity(direction) {
  const currentId = route.params.cityId
  const currentIndex = cityOrder.indexOf(currentId)
  let nextIndex = currentIndex + direction

  // 첫 도시에서 이전을 누르면 마지막 도시로 이동합니다.
  if (nextIndex < 0) {
    nextIndex = cityOrder.length - 1
  }

  // 마지막 도시에서 다음을 누르면 첫 도시로 이동합니다.
  if (nextIndex >= cityOrder.length) {
    nextIndex = 0
  }

  const nextId = cityOrder[nextIndex]
  cityData.value = mockDetails[nextId]
  router.push(`/weather/${nextId}`)
}
</script>

<template>
  <!-- 선택된 도시의 상세 정보를 보여주는 화면입니다. -->
  <div class="detail-container">
    <h3>지역별 상세 기상 관측 정보</h3>
    <hr />

    <!-- cityData가 있을 때만 상세 정보를 표시합니다. -->
    <div v-if="cityData" class="info-card">
      <h4>지정 지역: {{ cityData.name }}</h4>
      <p>
        실시간 기온: <strong>{{ cityData.temp }}°C</strong>
      </p>
      <p>기상 현황: {{ cityData.status }}</p>
      <p>대기 습도: {{ cityData.humidity }}</p>
      <p>현재 풍속: {{ cityData.wind }}</p>
    </div>
    <!-- 주소에 해당하는 도시 데이터가 없을 때 표시합니다. -->
    <div v-else>
      <p>해당 지역의 상세 데이터 장부가 존재하지 않습니다.</p>
    </div>

    <!-- 클릭하면 Router의 4번 화면으로 돌아갑니다. -->
    <div class="detail-buttons">
      <button class="move-btn" @click="moveCity(-1)">← 이전 도시</button>
      <button class="back-btn" @click="router.push('/router')">목록으로</button>
      <button class="move-btn" @click="moveCity(1)">다음 도시 →</button>
    </div>
  </div>
</template>

<style scoped>
/* scoped는 이 파일의 요소에만 아래 스타일을 적용합니다. */
.detail-container {
  margin: 0 auto;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
.info-card {
  background: #f1f2f6;
  padding: 15px;
  border-radius: 6px;
  margin: 15px 0;
}
.back-btn {
  padding: 8px 12px;
  background: #2c3e50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.detail-buttons {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.move-btn {
  padding: 8px 12px;
  color: #2c3e50;
  background: white;
  border: 1px solid #b8c2cc;
  border-radius: 4px;
  cursor: pointer;
}
</style>
