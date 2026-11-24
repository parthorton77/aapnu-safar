<script setup lang="ts">
import JourneySteps from '../editorial/JourneySteps.vue'
import { vReveal } from '../../composables/motion'
</script>

<template>
  <section id="how-it-works" class="proc" data-chapter="06" data-chapter-title="How it comes together" aria-labelledby="proc-title">
    <div class="frame">
      <div class="proc__head">
        <p class="meta" v-reveal>06 — How your journey comes together</p>
        <h2 id="proc-title" class="proc__title" v-reveal>Five stops <span class="italic">before the first.</span></h2>
        <aside class="proc__margin" v-reveal="0.1">
          <span class="meta meta--accent">Margin note</span>
          <p>Sending us your plans is an <strong>enquiry</strong>, not a booking. Nothing is confirmed until you accept a quotation and payment is agreed.</p>
        </aside>
      </div>
      <JourneySteps />
      <p class="proc__more" v-reveal>
        <RouterLink to="/how-it-works" class="cta">Read the full process and terms <span class="cta__arrow" aria-hidden="true">→</span></RouterLink>
      </p>
    </div>
  </section>
</template>

<style scoped>
.proc { padding-block: var(--section); }
.proc__head { display: grid; gap: 1.4rem; margin-bottom: 4rem; }
.proc__title { font-size: var(--step-4); }
.proc__title .italic { color: var(--terracotta-ink); }
.proc__margin { max-width: 34ch; font-size: var(--step--1); color: var(--ink-soft); padding: 1rem 0 0; border-top: 1px solid var(--rule-strong); }
.proc__margin p { margin: 0.4rem 0 0; }
.proc__more { margin-top: 5rem; }
@media (min-width: 900px) {
  .proc__head { grid-template-columns: 1fr 22rem; align-items: end; column-gap: var(--gutter); }
  .proc__head > .meta { grid-column: 1 / -1; }
  .proc__margin { transform: rotate(-1deg); }
}
</style>
