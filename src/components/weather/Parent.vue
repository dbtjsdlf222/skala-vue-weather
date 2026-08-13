<script setup>
import { computed, ref, watch } from 'vue'
import { ElMessageBox } from 'element-plus'
import BaseBoard from './BaseBoard.vue'
import SearchBar from './SearchBar.vue'
import Card from './Card.vue'
import { cityList } from '@/data/data.js'

const search = ref('')
const info = ref('카드를 클릭하거나 검색해 보세요.')
const favorite = ref([])

const result = computed(() => {
  const value = search.value.trim()
  if (!value) return cityList
  return cityList.filter((item) => item.name.includes(value))
})

const toggleFav = (id) => {
  if (favorite.value.includes(id)) {
    favorite.value = favorite.value.filter((item) => item !== id)
    return
  }
  favorite.value.push(id)
}

watch(info, (value) => {
  console.log(`선택 정보: ${value}`)
})

// 상세보기 버튼을 누르면 Element Plus 팝업을 보여준다.
const detail = async (name, status) => {
  await ElMessageBox.alert(`${name}의 현재 날씨는 [${status}] 상태입니다.`, '날씨 상세 정보', {
    confirmButtonText: '확인',
    type: 'info',
    showClose: false,
  })
}
</script>

<template>
  <div class="con">
    <BaseBoard>
      <SearchBar v-model="search" />
    </BaseBoard>

    <BaseBoard>
      <div class="title-row">
        <h3>지역별 날씨 현황</h3>
        <span class="count">관심 도시 {{ favorite.length }}개</span>
      </div>

      <Card
        v-for="item in result"
        :key="item.id"
        :item="item"
        :show-fav="true"
        :is-fav="favorite.includes(item.id)"
        @select="(msg) => (info = msg)"
        @detail="detail"
        @favorite="toggleFav(item.id)"
      />

      <p v-if="result.length === 0" class="empty">검색 결과와 일치하는 도시가 없습니다.</p>
    </BaseBoard>

    <div class="info">{{ info }}</div>
  </div>
</template>

<style scoped>
.con {
  width: 100%;
  max-width: 760px;
  margin: 0 auto;
}
</style>
