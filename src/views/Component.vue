<script setup>
// 여러 자식 컴포넌트를 관리하는 Parent 컴포넌트를 불러옵니다.
import Parent from '../components/weather/Parent.vue'
</script>

<template>
  <!-- Parent 안에는 SearchBar와 Card 컴포넌트가 들어 있습니다. -->
  <section>
    <h2>3. 컴포넌트 분리</h2>
    <p>검색창과 날씨 카드를 각각의 컴포넌트로 나눈 화면입니다.</p>
    <Parent />
  </section>
</template>
