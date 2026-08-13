<script setup>
import { computed, ref } from 'vue'
// 도시의 날씨 상태를 선택하는 UI 컴포넌트다.
import { ElOption, ElSelect } from 'element-plus'
import { cityList } from '@/data/data.js'
const search = ref('')
const filter = ref('전체')

const result = computed(() => {
  return cityList.filter((item) => {
    const sameName = item.name.includes(search.value)
    const sameStatus = filter.value === '전체' || item.status === filter.value
    return sameName && sameStatus
  })
})

const reset = () => {
  search.value = ''
  filter.value = '전체'
}
</script>

<template>
  <section>
    <h2>2. 도시 검색</h2>

    <div class="search-con">
      <div class="search-row">
        <input v-model="search" type="text" placeholder="도시 이름을 입력하세요" />
        
        <el-select v-model="filter">
          <el-option label="전체" value="전체" />
          <el-option label="맑음" value="맑음" />
          <el-option label="비" value="비" />
          <el-option label="구름" value="구름" />
          <el-option label="눈" value="눈" />
          <el-option label="소나기" value="소나기" />
          <el-option label="바람" value="바람" />
        </el-select>
      </div>

      <div class="btns">
        <button @click="reset">초기화</button>
      </div>
    </div>

    <div class="result">
      <strong>{{ result.length }}</strong>개의 검색 결과가 있습니다.
    </div>

    <div class="grid">
      <div v-for="item in result" :key="item.id" class="card simple">
        <span class="tag">{{ item.status }}</span>
        <h3>{{ item.name }}</h3>
        <p class="temp">{{ item.temp }}도</p>
      </div>
    </div>

    <p v-if="result.length === 0" class="empty">검색 결과가 없습니다.</p>
  </section>
</template>
