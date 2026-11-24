<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import { vReveal } from '../../composables/motion'
const EnquiryBuilder = defineAsyncComponent(() => import('../itinerary/EnquiryBuilder.vue'))
</script>

<template>
  <section id="plan" class="plan" data-chapter="08" data-chapter-title="Plan your journey" aria-labelledby="plan-title">
    <div class="frame plan__grid">
      <div class="plan__intro">
        <p class="meta" v-reveal>08 — Plan your journey</p>
        <h2 id="plan-title" class="plan__title" v-reveal>Write the <span class="italic">first page</span> of the trip.</h2>
        <p class="plan__text" v-reveal>
          Tell us who’s travelling, when, and where they’d like to go. Our team reads every itinerary, then replies with
          a clear, personal quotation.
        </p>
        <ul class="plan__facts" v-reveal>
          <li><span class="meta">No instant fares</span> Every price is worked out from your actual plan.</li>
          <li><span class="meta">No automatic booking</span> Availability is checked by a person before anything is confirmed.</li>
          <li><span class="meta">Saved as you go</span> Your answers are kept on this device until you send them.</li>
        </ul>
      </div>
      <div class="plan__builder">
        <EnquiryBuilder compact />
      </div>
    </div>
  </section>
</template>

<style scoped>
.plan { padding-block: var(--section); background: var(--paper-deep); border-block: 1px solid var(--rule); }
.plan__grid { display: grid; gap: 3rem; }
.plan__title { font-size: var(--step-4); margin: 1rem 0 1.4rem; }
.plan__title .italic { color: var(--terracotta-ink); }
.plan__text { color: var(--ink-soft); max-width: 40ch; }
.plan__facts { list-style: none; padding: 0; margin: 2rem 0 0; border-top: 1px solid var(--rule-strong); }
.plan__facts li { padding: 0.8rem 0; border-bottom: 1px solid var(--rule); font-size: var(--step--1); }
.plan__facts .meta { display: block; color: var(--terracotta-ink); margin-bottom: 0.2rem; }
.plan__builder { min-width: 0; }
@media (min-width: 1000px) {
  .plan__grid { grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.9fr); align-items: start; }
  .plan__intro { position: sticky; top: 6.5rem; }
}
</style>
