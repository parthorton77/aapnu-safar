<script setup lang="ts">
import { vReveal } from '../../composables/motion'
defineProps<{ no: string; kicker: string; lede?: string }>()
</script>

<template>
  <header class="ph" :data-chapter="no" :data-chapter-title="kicker">
    <div class="frame ph__grid">
      <p class="meta ph__kicker" v-reveal><span class="ph__no">{{ no }}</span> {{ kicker }}</p>
      <h1 class="ph__title" v-reveal><slot /></h1>
      <p v-if="lede" class="lede ph__lede" v-reveal="0.1">{{ lede }}</p>
      <div v-if="$slots.aside" class="ph__aside" v-reveal="0.15"><slot name="aside" /></div>
    </div>
  </header>
</template>

<style scoped>
.ph { padding-top: clamp(2.5rem, 6vw, 6rem); padding-bottom: clamp(3rem, 6vw, 6rem); border-bottom: 1px solid var(--rule); }
.ph__grid { display: grid; gap: 1.6rem; grid-template-columns: minmax(0, 1fr); }
.ph__no { color: var(--terracotta-ink); margin-right: 0.6rem; }
.ph__title { font-size: var(--step-5); line-height: 0.9; letter-spacing: -0.02em; max-width: 14ch; }
.ph__title :deep(.italic) { color: var(--forest); }
@media (min-width: 900px) {
  .ph__grid { grid-template-columns: repeat(12, minmax(0, 1fr)); column-gap: var(--gutter); }
  .ph__kicker, .ph__title { grid-column: 1 / 10; }
  .ph__lede { grid-column: 7 / 12; }
  .ph__aside { grid-column: 1 / 6; grid-row: 3; align-self: end; }
}
</style>
