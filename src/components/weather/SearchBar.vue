<script setup>
// 입력값을 부모에게 전달할 update-query 이벤트를 등록합니다.
defineEmits(['update-query'])

// 부모가 전달한 현재 검색어를 currentQuery라는 이름으로 받습니다.
defineProps({
  currentQuery: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <!-- 검색 입력을 담당하는 자식 컴포넌트입니다. -->
  <div class="search-inner">
    <h3>도시 검색</h3>
    <!-- 입력값이 바뀌면 $emit으로 새 값을 부모에게 보냅니다. -->
    <input type="text" :value="currentQuery" @input="$emit('update-query', $event.target.value)" placeholder="검색할 도시 이름 입력" />
    <p>
      검색 중인 도시: <strong>{{ currentQuery }}</strong>
    </p>
  </div>
</template>
