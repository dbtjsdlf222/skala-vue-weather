<script setup>
// ref는 상태 저장, computed는 검색 결과 계산, watch는 값 감시에 사용합니다.
// onMounted는 화면이 처음 나타난 뒤 실행됩니다.
import { ref, computed, watch, onMounted } from 'vue'
// useRouter는 주소 이동, useRoute는 현재 주소 확인에 사용합니다.
import { useRouter, useRoute } from 'vue-router'

// 4번 화면에서 사용할 자식 컴포넌트를 불러옵니다.
import BaseDashboardCard from '../components/weather/BaseDashboardCard.vue'
import SearchBar from '../components/weather/SearchBar.vue'
import Card from '../components/weather/Card.vue'

// Router와 현재 Route를 변수에 저장합니다.
const router = useRouter()
const route = useRoute()

// 화면에 출력할 연습용 날씨 배열입니다.
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
])

// 검색어와 사용자가 선택한 도시 안내 문구를 저장합니다.
const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')

// 화면이 처음 열릴 때 주소의 ?search= 값을 검색창에 넣습니다.
onMounted(() => {
  if (route.query.search) {
    searchQuery.value = route.query.search
  }
})

// 검색어가 바뀔 때마다 주소의 ?search= 값도 변경합니다.
watch(searchQuery, (newQuery) => {
  router.push({
    path: route.path,
    query: { search: newQuery || undefined },
  })
})

// 검색어나 날씨 배열이 바뀌면 검색 결과를 다시 계산합니다.
const filteredWeatherList = computed(() => {
  // trim은 검색어 앞뒤의 공백을 제거합니다.
  const query = searchQuery.value.trim()
  // 검색어가 없으면 전체 날씨 배열을 반환합니다.
  if (!query) return weatherList.value
  // 검색어가 포함된 도시만 반환합니다.
  return weatherList.value.filter((item) => item.name.includes(query))
})

// 상세보기 버튼을 누른 도시의 상세 주소로 이동합니다.
const handleDetailJump = (id) => {
  router.push(`/weather/${id}`)
}
</script>

<template>
  <!-- 4번 Vue Router 학습 화면입니다. -->
  <section>
    <h2>4. Vue Router 활용</h2>
    <p>상세보기 버튼을 누르면 해당 도시의 상세 주소로 이동합니다.</p>
    <p class="route-note">현재 검색 주소: {{ route.fullPath }}</p>

    <div class="dashboard-wrapper">
    <!-- slot을 가진 공통 박스 안에 검색 컴포넌트를 넣습니다. -->
    <BaseDashboardCard>
      <!-- 검색값은 props로 전달하고, 변경값은 emit으로 돌려받습니다. -->
      <SearchBar :current-query="searchQuery" @update-query="(val) => (searchQuery = val)" />
    </BaseDashboardCard>

    <BaseDashboardCard>
      <div class="section-title-row">
        <h3>🏙️ 지역별 날씨 현황</h3>
        <span class="count-chip">{{ filteredWeatherList.length }}개 결과</span>
      </div>
      <!-- 검색된 날씨 수만큼 Card 컴포넌트를 반복해서 만듭니다. -->
      <Card v-for="item in filteredWeatherList" :key="item.id" :city-item="item" @select-card="(msg) => (selectedCityInfo = msg)" @click-detail="handleDetailJump(item.id)" />
    </BaseDashboardCard>
    <!-- 카드를 눌렀을 때 자식 컴포넌트에서 받은 문구를 출력합니다. -->
    <div class="status-bar">{{ selectedCityInfo }}</div>
    </div>
  </section>
</template>

<style scoped>
/* 이 스타일은 Router.vue 안의 상태 표시줄에만 적용됩니다. */
.status-bar {
  background: #e8f5e9;
  padding: 10px;
  text-align: center;
  color: #2e7d32;
  font-weight: bold;
  border-radius: 6px;
}

.route-note {
  padding: 8px 12px;
  color: #6255d9;
  background: #f1efff;
  border-radius: 8px;
  font-family: monospace;
}
</style>
