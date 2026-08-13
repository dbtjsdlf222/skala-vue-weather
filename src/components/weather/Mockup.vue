<script setup>
import { ref } from 'vue'
import { cityList } from '@/data/data.js'

const search = ref('')
const info = ref('카드를 클릭하거나 검색해 보세요.')
const selected = ref('')

const select = (item) => {
  selected.value = item.name
  info.value = `${item.name}이 선택되었습니다.`
}

const detail = (name, status) => {
  window.alert(`${name}의 현재 날씨는 [${status}] 상태입니다.`)
}
</script>

<template>
  <div class="con">
    <section class="search-con">
      <h3>도시 검색</h3>
      <input v-model="search" type="text" placeholder="검색할 도시 이름 입력" />
      <p>검색 중인 도시: <strong>{{ search }}</strong></p>
    </section>

    <section class="cityList-con">
      <div class="title-row">
        <h3>지역별 날씨 현황</h3>
        <span class="count">총 {{ cityList.length }}개 도시</span>
      </div>

      <div
        v-for="item in cityList"
        :key="item.id"
        class="card"
        :class="{ selected: selected === item.name }"
        @click="select(item)"
      >
        <div class="card-main">
          <div>
            <h4>{{ item.name }} ({{ item.status }})</h4>
            <p>현재 기온: {{ item.temp }}도</p>
          </div>
        </div>

        <span v-if="item.temp >= 25" class="state hot">더움 (25도 이상)</span>
        <span v-else class="state cool">추움 (25도 미만)</span>
        <button class="detail-btn" @click.stop="detail(item.name, item.status)">상세보기</button>
      </div>
    </section>

    <div class="info">{{ info }}</div>
  </div>
</template>
