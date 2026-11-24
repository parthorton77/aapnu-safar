<script setup lang="ts">
import { vReveal } from '../../composables/motion'
withDefaults(defineProps<{ chapter?: string }>(), { chapter: '09' })
</script>

<template>
  <section class="close" :data-chapter="chapter" data-chapter-title="The people" aria-labelledby="close-title">
    <div class="frame">
      <svg class="close__route" viewBox="0 0 1200 120" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 90 C 200 90, 260 20, 460 30 S 760 110, 960 60 S 1140 20, 1200 30" />
      </svg>
      <h2 id="close-title" class="close__title" v-reveal>
        Some journeys are about the places.<br />
        <span class="italic">The best ones are about the people.</span>
      </h2>
      <RouterLink to="/plan-your-journey" class="cta cta--solid close__cta" v-reveal="0.15">
        Let’s plan your Gujarat journey <span class="cta__arrow" aria-hidden="true">→</span>
      </RouterLink>
    </div>
  </section>
</template>

<style scoped>
.close { padding-block: var(--section); text-align: center; }
.close__route { width: 100%; height: 70px; margin-bottom: 3rem; }
.close__route path { fill: none; stroke: var(--terracotta); stroke-width: 1.5; stroke-dasharray: 5 7; vector-effect: non-scaling-stroke; }
.close__title { font-size: var(--step-4); max-width: 18ch; margin-inline: auto; }
.close__title .italic { color: var(--forest); }
.close__cta { margin-top: 3rem; }
</style>
