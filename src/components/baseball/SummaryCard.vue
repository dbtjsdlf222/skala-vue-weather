<script setup>
defineProps({
  label: { type: String, required: true },
  description: { type: String, default: '' },
  tone: { type: String, default: 'blue' },
})
</script>

<template>
  <article class="summary-card" :class="tone">
    <span>{{ label }}</span>
    <strong><slot /></strong>
    <small>{{ description }}</small>
  </article>
</template>

<style scoped>
.summary-card {
  min-width: 0;
  padding: 20px;
  background: #ffffff;
  border: 1px solid #e4e9f1;
  border-top: 3px solid #3267e3;
  border-radius: 10px;
  box-shadow: 0 7px 22px rgba(30, 45, 73, 0.06);
}
.summary-card.orange { border-top-color: #e9902a; }
.summary-card.red { border-top-color: #dc4b55; }
.summary-card.green { border-top-color: #24936f; }
.summary-card span,
.summary-card small { display: block; color: #738096; }
.summary-card span { font-size: 12px; font-weight: 800; letter-spacing: 0.05em; }
.summary-card strong { display: block; margin: 8px 0 5px; color: #18243a; font-size: 28px; line-height: 1; }
.summary-card small { overflow: hidden; font-size: 12px; text-overflow: ellipsis; white-space: nowrap; }
</style>
