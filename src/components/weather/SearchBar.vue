<script setup>
defineProps({
  modelValue: {
    type: String,
    default: '',
  },
})

defineEmits(['update:modelValue'])
</script>

<template>
  <div class="search">
    <h3>도시 검색</h3>
    <input
      type="text"
      :value="modelValue"
      placeholder="검색할 도시 이름 입력"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <p>검색 중인 도시: <strong>{{ modelValue }}</strong></p>
  </div>
</template>
