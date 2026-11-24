<script setup lang="ts">
import EditorialPhoto from '../editorial/EditorialPhoto.vue'
import { vReveal } from '../../composables/motion'

const ones = [
  { what: 'family', note: 'Never shared with unrelated passengers' },
  { what: 'dedicated vehicle', note: 'Reserved for your agreed dates' },
  { what: 'driver', note: 'Introduced to you before you travel' },
  { what: 'agreed itinerary', note: 'Reviewed with you, day by day' },
]
</script>

<template>
  <section class="phil" data-chapter="02" data-chapter-title="The philosophy" aria-labelledby="phil-title">
    <div class="frame phil__grid">
      <p class="meta phil__mark" v-reveal>02 — The philosophy</p>
      <h2 id="phil-title" class="phil__title" v-reveal>
        Not just a ride.<br />
        <span class="italic">A little more care.</span>
      </h2>

      <div class="phil__text" v-reveal>
        <p>
          When you live abroad, arranging travel for the people you love can feel uncertain. Will the taxi arrive?
          Will the driver wait while your parents rest? Will anyone pick up the phone?
        </p>
        <p>
          Aapnu Safar works differently. Before anyone travels, we agree the whole journey with you: the dates, the
          daily plan, the overnight stops. For those days, one vehicle and one driver belong to your family alone.
        </p>
      </div>

      <ol class="phil__ones" aria-label="The Aapnu Safar model">
        <li v-for="(o, i) in ones" :key="o.what" v-reveal="i * 0.08">
          <span class="phil__one italic">One</span>
          <span class="phil__what">{{ o.what }}.</span>
          <span class="meta phil__note">{{ o.note }}</span>
        </li>
      </ol>

      <div class="phil__photo" v-reveal>
        <EditorialPhoto photo="countryside-road" ratio="3 / 4" :parallax="0.12" sizes="(min-width: 900px) 30vw, 90vw"
          caption="The road between family visits — planned, not left to chance." />
      </div>
    </div>
  </section>
</template>

<style scoped>
.phil { padding-block: var(--section); border-top: 1px solid var(--rule); }
.phil__grid { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); column-gap: var(--gutter); row-gap: 2.5rem; }
.phil__mark { grid-column: 1 / -1; }
.phil__title { grid-column: 1 / -1; font-size: var(--step-4); }
.phil__title .italic { color: var(--terracotta-ink); }
.phil__text { grid-column: 1 / -1; max-width: 52ch; color: var(--ink-soft); }
.phil__ones { grid-column: 1 / -1; list-style: none; padding: 0; margin: 0; border-top: 1px solid var(--rule-strong); }
.phil__ones li {
  display: grid; grid-template-columns: auto 1fr; column-gap: 0.6em; align-items: baseline;
  padding: 1rem 0 1.1rem; border-bottom: 1px solid var(--rule);
}
.phil__one { font-family: var(--font-display); font-size: var(--step-3); color: var(--terracotta-ink); line-height: 1; }
.phil__what { font-family: var(--font-display); font-size: var(--step-3); line-height: 1; }
.phil__note { grid-column: 1 / -1; margin-top: 0.5rem; }
.phil__photo { grid-column: 2 / -1; }

@media (min-width: 900px) {
  .phil__title { grid-column: 1 / 9; }
  .phil__text { grid-column: 8 / 13; grid-row: 2; align-self: end; }
  .phil__ones { grid-column: 1 / 8; grid-row: 3 / 5; align-self: start; margin-top: 3rem; }
  .phil__ones li { grid-template-columns: auto auto 1fr; }
  .phil__note { grid-column: 3; margin: 0; text-align: right; }
  .phil__photo { grid-column: 9 / 13; grid-row: 3 / 5; margin-top: -2rem; }
}
</style>
