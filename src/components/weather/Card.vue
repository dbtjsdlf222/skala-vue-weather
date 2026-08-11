<script setup>
// defineProps는 부모가 전달한 데이터를 자식 컴포넌트에서 받습니다.
defineProps({
  // cityItem에는 도시 이름, 온도, 날씨 상태가 들어 있습니다.
  cityItem: {
    type: Object,
    required: true,
  },
  // 부모가 true를 전달했을 때만 관심 도시 버튼을 표시합니다.
  showFavorite: {
    type: Boolean,
    default: false,
  },
  // 현재 카드가 관심 도시인지 부모에게 전달받습니다.
  isFavorite: {
    type: Boolean,
    default: false,
  },
})

// defineEmits는 자식이 부모에게 보낼 이벤트 이름을 등록합니다.
const emit = defineEmits(['select-card', 'click-detail', 'toggle-favorite'])
</script>

<template>
  <!-- 카드 전체를 클릭하면 선택한 도시 문구를 부모에게 보냅니다. -->
  <div class="weather-card" @click="emit('select-card', `${cityItem.name}이 선택되었습니다.`)">
    <!-- 부모에게 받은 cityItem의 값을 화면에 출력합니다. -->
    <h4>{{ cityItem.name }} ({{ cityItem.status }})</h4>
    <p>현재 기온: {{ cityItem.temp }}°C</p>

    <!-- 온도가 25도 이상인지에 따라 다른 배지를 표시합니다. -->
    <span v-if="cityItem.temp >= 25" class="badge hot">더움</span>
    <span v-else class="badge cool">추움</span>

    <!-- 관심 도시 버튼을 누르면 부모에게 toggle-favorite 이벤트를 보냅니다. -->
    <button v-if="showFavorite" class="favorite-btn" @click.stop="emit('toggle-favorite')">
      {{ isFavorite ? '★ 관심 도시' : '☆ 관심 등록' }}
    </button>

    <!-- .stop은 버튼 클릭 이벤트가 바깥 카드까지 전달되는 것을 막습니다. -->
    <button class="btn-detail" @click.stop="emit('click-detail', cityItem.name, cityItem.status)">상세보기</button>
  </div>
</template>

<style scoped>
/* scoped를 사용해서 카드 스타일이 다른 컴포넌트에 영향을 주지 않게 합니다. */
.weather-card {
  background: #fff;
  border: 1px solid #dee2e6;
  padding: 12px;
  margin-bottom: 10px;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
}
.badge {
  display: inline-block;
  padding: 4px 8px;
  font-size: 12px;
  border-radius: 4px;
  color: #fff;
}
.hot {
  background-color: #ff7675;
}
.cool {
  background-color: #74b9ff;
}
.btn-detail {
  position: absolute;
  right: 12px;
  top: 15px;
  padding: 6px 10px;
  cursor: pointer;
}

.favorite-btn {
  margin-left: 8px;
  padding: 5px 9px;
  color: #8a6400;
  background: #fff5c2;
  border: 1px solid #f0d46a;
  border-radius: 6px;
  cursor: pointer;
}
</style>
