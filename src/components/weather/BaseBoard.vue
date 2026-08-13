<template>
  <!-- 부모가 전달한 화면 내용을 공통 보드 안에 표시한다. -->
  <div class="box">
    <slot />
  </div>
</template>

<style scoped>
.box {
  margin-bottom: 15px;
  padding: 15px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
}
</style>
