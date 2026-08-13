<script setup>
defineProps({
  item: { type: Object, equired: true, },  //날씨 데이터 객체
  showFav: { type: Boolean, default: false, }, // 관심 등록 버튼을 보여줄지 여부
  isFav: { type: Boolean, default: false, },   // 관심 등록 상태
})

const emit = defineEmits(['select', 'detail', 'favorite'])

</script>

<template>
  <div class="card" @click="emit('select', `${item.name}이 선택되었습니다.`)">
    <h4>{{ item.name }} ({{ item.status }})</h4>
    <p>현재 기온: {{ item.temp }}도</p>

    <span v-if="item.temp >= 25" class="state hot">더움</span>
    <span v-else class="state cool">추움</span>

    <button v-if="showFav" class="fav-btn" @click.stop="emit('favorite')">
      {{ isFav ? '관심 해제' : '관심 등록' }}
    </button>

    <button class="detail-btn" @click.stop="emit('detail', item.name, item.status)">상세보기</button>
  </div>
</template>

<style scoped>
.card {
  position: relative;
  margin-bottom: 10px;
  padding: 12px;
  background: #fff;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  cursor: pointer;
}

.state {
  display: inline-block;
  padding: 4px 8px;
  color: #fff;
  border-radius: 4px;
  font-size: 12px;
}

.hot {
  background: #ff7675;
}

.cool {
  background: #74b9ff;
}

.detail-btn {
  position: absolute;
  top: 15px;
  right: 12px;
  padding: 6px 10px;
}

.fav-btn {
  margin-left: 8px;
  padding: 5px 9px;
  color: #8a6400;
  background: #fff5c2;
  border: 1px solid #f0d46a;
  border-radius: 6px;
}
</style>
