<template>
  <!-- slot 위치에 부모 컴포넌트가 전달한 화면 내용이 들어갑니다. -->
  <div class="base-dashboard-card">
    <slot></slot>
  </div>
</template>

<style scoped>
/* 이 스타일은 BaseDashboardCard 컴포넌트 안에서만 적용됩니다. */
.base-dashboard-card {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
  border: 1px solid #e9ecef;
}
</style>
