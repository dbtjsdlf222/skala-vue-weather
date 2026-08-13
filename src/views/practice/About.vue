<script setup>
// 각 실습 탭에서 구현한 내용을 소개 화면에 표시한다.
const tabs = [
  { number: 1, name: '기본', description: 'ref, v-for, v-if와 클릭 이벤트로 날씨 목록을 구현했습니다.' },
  { number: 2, name: '검색', description: 'v-model과 computed를 사용해 도시와 날씨 상태를 검색합니다.' },
  { number: 3, name: '컴포넌트', description: 'Props, Emit, Slot으로 부모와 자식 컴포넌트를 연결했습니다.' },
  { number: 4, name: 'Router', description: 'Query String으로 검색어와 선택한 도시 ID를 전달합니다.' },
  { number: 5, name: 'Store', description: 'Pinia로 온도 단위, 다크 모드와 선택 도시를 관리합니다.' },
  { number: 6, name: 'API1', description: 'Axios와 Open-Meteo로 전국 날씨와 생활 정보를 조회합니다.' },
  { number: 7, name: 'API2', description: 'Axios와 OpenWeatherMap으로 날씨 조회와 측정소 CRUD를 실습합니다.' },
]
</script>

<template>
  <section>
    <h2>0. 프로젝트 소개</h2>
    <p>Vue 기본 문법부터 API 통신까지 탭별로 나누어 구현한 날씨 실습 프로젝트입니다.</p>

    <div class="about-grid">
      <article v-for="tab in tabs" :key="tab.number" class="about-card">
        <span>{{ tab.number }}</span>
        <div>
          <h3>{{ tab.name }}</h3>
          <p>{{ tab.description }}</p>
        </div>
      </article>
    </div>

    <div class="assignment-info">
      <strong>과제 화면</strong>
      <p>상단 토글을 누르면 날씨에 따른 야구 경기 취소 가능성을 보여주는 BALLCAST로 이동합니다.</p>
    </div>
  </section>
</template>

<style scoped>
.about-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 24px;
}

.about-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  background: #ffffff;
  border: 1px solid #e2e7f0;
  border-radius: 12px;
}

.about-card > span {
  display: grid;
  flex: 0 0 38px;
  place-items: center;
  width: 38px;
  height: 38px;
  color: #ffffff;
  background: #5b5bd6;
  border-radius: 10px;
  font-weight: 800;
}

.about-card h3,
.about-card p,
.assignment-info p {
  margin: 0;
}

.about-card h3 {
  margin-bottom: 5px;
  font-size: 15px;
}

.about-card p,
.assignment-info p {
  color: #6d778b;
  font-size: 13px;
  line-height: 1.6;
}

.assignment-info {
  margin-top: 12px;
  padding: 16px;
  background: #f3f5ff;
  border: 1px solid #dfe2ff;
  border-radius: 12px;
}

.assignment-info strong {
  display: block;
  margin-bottom: 5px;
  color: #4646b5;
}

@media (max-width: 700px) {
  .about-grid {
    grid-template-columns: 1fr;
  }
}
</style>
