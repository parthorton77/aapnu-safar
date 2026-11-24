<script setup lang="ts">
import GujaratAtlas from '../components/map/GujaratAtlas.vue'
</script>

<template>
  <section class="nf">
    <div class="frame nf__grid">
      <div>
        <p class="meta meta--accent">Error 404</p>
        <h1 class="nf__title">This road is <span class="italic">off the map.</span></h1>
        <p class="lede">The page you were looking for isn’t here. Let’s get you back on the route.</p>
        <RouterLink to="/" class="cta cta--solid">Return home <span class="cta__arrow" aria-hidden="true">→</span></RouterLink>
      </div>
      <GujaratAtlas :progress="1" :interactive="false" :show-distances="false" />
    </div>
  </section>
</template>

<style scoped>
.nf { padding-block: var(--section); }
.nf__grid { display: grid; gap: 3rem; align-items: center; }
.nf__title { font-size: var(--step-5); margin: 1rem 0 1.4rem; }
.nf__title .italic { color: var(--terracotta-ink); }
.nf .lede { margin-bottom: 2rem; }
@media (min-width: 900px) { .nf__grid { grid-template-columns: 1fr 1.2fr; } }
</style>
