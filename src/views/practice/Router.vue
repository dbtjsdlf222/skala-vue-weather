<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseBoard from '../../components/weather/BaseBoard.vue'
import SearchBar from '../../components/weather/SearchBar.vue'
import Card from '../../components/weather/Card.vue'
import { cityList } from '@/data/data.js'

const router = useRouter()
const route = useRoute()
const search = ref('')
const info = ref('지역을 클릭해 보세요.')

onMounted(() => {
  search.value = route.query.search || ''
})

watch(search, (value) => {
  router.push({ path: route.path, query: { search: value || undefined } })
})

const result = computed(() => {
  const value = search.value.trim()
  if (!value) return cityList
  return cityList.filter((item) => item.name.includes(value))
})

// 선택한 도시 ID를 쿼리스트링에 넣어 상세 화면으로 이동한다.
function goDetail(cityId) {
  router.push({
    path: '/weather',
    query: { cityId: cityId },
  })
}
</script>

<template>
  <section>
    <h2>4. Vue Router 활용</h2>
    <p>상세보기 버튼을 누르면 해당 도시의 상세 주소로 이동합니다.</p>
    <p class="route-info">현재 검색 주소: {{ route.fullPath }}</p>

    <div class="con">
      <BaseBoard>
        <SearchBar v-model="search" />
      </BaseBoard>

      <BaseBoard>
        <div class="title-row">
          <h3>지역별 날씨 현황</h3>
          <span class="count">{{ result.length }}개 결과</span>
        </div>

        <Card
          v-for="item in result"
          :key="item.id"
          :item="item"
          @select="(msg) => (info = msg)"
          @detail="goDetail(item.id)"
        />
      </BaseBoard>

      <div class="info">{{ info }}</div>
    </div>
  </section>
</template>

<style scoped>
.info {
  padding: 10px;
  color: #2e7d32;
  background: #e8f5e9;
  border-radius: 6px;
  text-align: center;
  font-weight: bold;
}

.route-info {
  padding: 8px 12px;
  color: #6255d9;
  background: #f1efff;
  border-radius: 8px;
  font-family: monospace;
}
</style>
