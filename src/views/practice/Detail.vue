<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { cityList } from '@/data/data.js'

const route = useRoute()
const router = useRouter()

// 도시 목록에서 ID만 꺼내 이전·다음 이동 순서를 만든다.
const order = cityList.map((item) => item.id)

// 현재 화면에 표시할 도시 정보를 저장한다.
const city = ref(null)

// 화면이 처음 열리면 쿼리스트링의 도시 ID로 상세 정보를 찾는다.
onMounted(() => {
  const cityId = route.query.cityId
  city.value = cityList.find((item) => item.id === cityId) || null
})

// step이 -1이면 이전 도시, 1이면 다음 도시로 이동한다.
const move = (step) => {
  const currentIndex = order.indexOf(route.query.cityId)
  let nextIndex = currentIndex + step

  // 첫 도시에서 이전을 누르면 마지막 도시로 이동한다.
  if (nextIndex < 0) {
    nextIndex = order.length - 1
  }

  // 마지막 도시에서 다음을 누르면 첫 도시로 이동한다.
  if (nextIndex >= order.length) {
    nextIndex = 0
  }

  const nextId = order[nextIndex]
  city.value = cityList.find((item) => item.id === nextId) || null
  router.push({
    path: '/weather',
    query: { cityId: nextId },
  })
}
</script>

<template>
  <div class="detail-con">
    <h3>지역별 상세 기상 관측 정보</h3>
    <hr />

    <div v-if="city" class="detail-box">
      <h4>지정 지역: {{ city.address }}</h4>
      <p>실시간 기온: <strong>{{ city.temp }}도</strong></p>
      <p>기상 현황: {{ city.status }}</p>
      <p>대기 습도: {{ city.humidity }}</p>
      <p>현재 풍속: {{ city.wind }}</p>
    </div>

    <p v-else>해당 지역의 상세 데이터가 없습니다.</p>

    <div class="btns">
      <button class="btn" @click="move(-1)">이전 도시</button>
      <button class="btn back" @click="router.push('/router')">목록으로</button>
      <button class="btn" @click="move(1)">다음 도시</button>
    </div>
  </div>
</template>

<style scoped>
.detail-con {
  margin: 0 auto;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.detail-box {
  margin: 15px 0;
  padding: 15px;
  background: #f1f2f6;
  border-radius: 6px;
}

.btns {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.btn {
  padding: 8px 12px;
  color: #2c3e50;
  background: white;
  border: 1px solid #b8c2cc;
  border-radius: 4px;
}

.back {
  color: white;
  background: #2c3e50;
  border: 0;
}
</style>
