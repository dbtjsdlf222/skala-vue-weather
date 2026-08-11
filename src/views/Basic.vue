<script setup>
// 기본 날씨 기능을 가진 Mockup 컴포넌트를 불러옵니다.
import Mockup from '../components/weather/Mockup.vue'
</script>

<template>
  <!-- 불러온 Mockup 컴포넌트를 1번 화면에 배치합니다. -->
  <section>
    <h2>1. 기본 날씨 화면</h2>
    <p>배열의 날씨 정보를 화면에 반복해서 출력합니다.</p>
    <Mockup />
  </section>
</template>
