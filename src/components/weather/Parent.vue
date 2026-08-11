<script setup>
// ref는 상태 저장, computed는 검색 결과 계산에 사용합니다.
// watch와 watchEffect는 값의 변화를 확인하는 학습용 기능입니다.
import { ref, computed, watch, watchEffect } from 'vue'
// 부모 화면에서 조립할 세 개의 자식 컴포넌트를 불러옵니다.
import BaseDashboardCard from './BaseDashboardCard.vue'
import SearchBar from './SearchBar.vue'
import Card from './Card.vue'

// 자식 Card에 전달할 원본 날씨 배열입니다.
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
])

// SearchBar에서 받은 검색어를 저장합니다.
const searchQuery = ref('')
// Card에서 받은 선택 결과 문구를 저장합니다.
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')
// 관심 도시로 선택한 ID들을 배열로 저장합니다.
const favoriteCityIds = ref([])

// 관심 도시 버튼을 누르면 ID를 추가하거나 제거합니다.
function toggleFavorite(cityId) {
  if (favoriteCityIds.value.includes(cityId)) {
    favoriteCityIds.value = favoriteCityIds.value.filter(function (id) {
      return id !== cityId
    })
  } else {
    favoriteCityIds.value.push(cityId)
  }
}

// 검색어가 바뀌면 조건에 맞는 날씨 배열을 자동으로 계산합니다.
const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()
  if (!query) return weatherList.value
  return weatherList.value.filter((item) => item.name.includes(query))
})

// 선택 안내 문구가 바뀔 때마다 콘솔에 기록합니다.
watch(selectedCityInfo, (newInfo) => {
  console.log(`👁️‍🗨️ [watch 감지] 상태 바 문구가 업데이트되었습니다 -> "${newInfo}"`)
})

// 함수 안에서 사용하는 searchQuery가 바뀔 때마다 자동 실행됩니다.
watchEffect(() => {
  console.log(`🤖 [watchEffect 자동 호출] 현재 검색어 '${searchQuery.value}'에 매칭되는 API 데이터를 필터링합니다.`)
})

// Card의 상세보기 버튼에서 받은 도시 정보를 알림창으로 보여줍니다.
const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}
</script>

<template>
  <!-- 부모 컴포넌트가 SearchBar와 Card를 조립하는 영역입니다. -->
  <div class="dashboard-wrapper">
    <!-- BaseDashboardCard의 slot 안에 SearchBar를 넣습니다. -->
    <BaseDashboardCard>
      <!-- 검색어는 props로 보내고 새 입력값은 emit으로 받습니다. -->
      <SearchBar :current-query="searchQuery" @update-query="(val) => (searchQuery = val)" />
    </BaseDashboardCard>

    <BaseDashboardCard>
      <div class="section-title-row">
        <h3>지역별 날씨 현황</h3>
        <span class="count-chip">관심 도시 {{ favoriteCityIds.length }}개</span>
      </div>

      <!-- 필터링된 배열의 각 항목을 Card의 city-item props로 전달합니다. -->
      <Card
        v-for="item in filteredWeatherList"
        :key="item.id"
        :city-item="item"
        :show-favorite="true"
        :is-favorite="favoriteCityIds.includes(item.id)"
        @select-card="(msg) => (selectedCityInfo = msg)"
        @click-detail="showDetail"
        @toggle-favorite="toggleFavorite(item.id)"
      />

      <!-- 검색 결과가 없을 때만 안내 문구를 보여줍니다. -->
      <p v-if="filteredWeatherList.length === 0" style="text-align: center; color: #e74c3c; padding: 10px 0">😭 검색 결과와 일치하는 도시가 없습니다.</p>
    </BaseDashboardCard>

    <!-- Card가 emit으로 보낸 선택 결과를 출력합니다. -->
    <div class="status-bar">
      {{ selectedCityInfo }}
    </div>
  </div>
</template>

<style scoped>
/* 이 스타일은 Parent 컴포넌트 안의 dashboard-wrapper에만 적용됩니다. */
.dashboard-wrapper {
  width: 100%;
  max-width: 760px;
  margin: 0 auto;
}
</style>
