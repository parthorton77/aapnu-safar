<script setup lang="ts">
import PageHeader from '../components/editorial/PageHeader.vue'
import EditorialPhoto from '../components/editorial/EditorialPhoto.vue'
import TermsLedger from '../components/editorial/TermsLedger.vue'
import ClosingStatement from '../components/editorial/ClosingStatement.vue'
import { vReveal } from '../composables/motion'

const compare = [
  ['Who rides', 'Whoever booked that ride', 'Your family only, for the agreed dates'],
  ['The driver', 'Whoever is nearby', 'One dedicated driver, introduced before you travel'],
  ['The plan', 'Decided ride by ride', 'A day-by-day itinerary agreed in advance'],
  ['Waiting', 'Often charged or refused', 'Built into the agreed service hours'],
  ['The price', 'Known at the end of each ride', 'A written quotation before anything is confirmed'],
  ['Staying in touch', 'An app notification', 'A person who knows your family’s plan'],
]
</script>

<template>
  <div>
    <PageHeader no="03" kicker="Exclusive family travel" lede="Aapnu Safar reserves one vehicle and one driver for one family, for the dates and itinerary you agree with us. Nothing is shared, and nothing is left to chance.">
      Yours, <span class="italic">and only yours.</span>
      <template #aside>
        <EditorialPhoto photo="vehicle-profile" ratio="16 / 10" sizes="(min-width: 900px) 36vw, 92vw" label="The initial vehicle" caption="Maruti Suzuki Ertiga. The photograph shows the model, not a specific Aapnu Safar vehicle." />
      </template>
    </PageHeader>

    <section class="cmp" data-chapter="03.1" data-chapter-title="Not a taxi">
      <div class="frame">
        <h2 class="cmp__title" v-reveal>A booked ride <span class="italic">vs.</span> an agreed journey</h2>
        <div class="cmp__table" role="table" aria-label="Comparison between booking individual rides and Aapnu Safar">
          <div class="cmp__row cmp__row--head" role="row">
            <span role="columnheader" class="meta">&nbsp;</span>
            <span role="columnheader" class="meta">Booking ride by ride</span>
            <span role="columnheader" class="meta meta--accent">Aapnu Safar</span>
          </div>
          <div v-for="(r, i) in compare" :key="r[0]" class="cmp__row" role="row" v-reveal="i * 0.04">
            <span role="rowheader" class="cmp__k">{{ r[0] }}</span>
            <span role="cell" class="cmp__a">{{ r[1] }}</span>
            <span role="cell" class="cmp__b">{{ r[2] }}</span>
          </div>
        </div>
      </div>
    </section>

    <section class="who" data-chapter="03.2" data-chapter-title="Who it’s for">
      <div class="frame who__grid">
        <article class="who__card" v-reveal>
          <p class="meta">Arranging from abroad</p>
          <h3>For the daughter in Toronto, the son in London, the cousins in Melbourne and Dubai.</h3>
          <p>You plan and approve the journey from wherever you live. We keep you informed, and we look after the people travelling in Gujarat.</p>
        </article>
        <article class="who__card who__card--alt" v-reveal="0.1">
          <p class="meta">Arranging in Gujarat</p>
          <h3>For families here, organising travel for parents and visiting relatives.</h3>
          <p>The same agreed itinerary, the same dedicated driver, the same clear quotation.</p>
        </article>
      </div>
    </section>

    <section class="terms" data-chapter="03.3" data-chapter-title="What’s agreed">
      <div class="frame">
        <h2 class="cmp__title" v-reveal>What we agree <span class="italic">together.</span></h2>
        <TermsLedger :only="['exclusive', 'dates-hours', 'km-limits', 'driver-rest', 'changes']" />
        <p class="terms__more"><RouterLink to="/how-it-works#terms" class="cta">See every term <span class="cta__arrow" aria-hidden="true">→</span></RouterLink></p>
      </div>
    </section>

    <ClosingStatement chapter="03.4" />
  </div>
</template>

<style scoped>
.cmp, .who, .terms { padding-block: var(--section); border-bottom: 1px solid var(--rule); }
.cmp__title { font-size: var(--step-4); margin-bottom: 3rem; max-width: 18ch; }
.cmp__title .italic { color: var(--terracotta-ink); }
.cmp__row { display: grid; grid-template-columns: 1fr; gap: 0.3rem; padding: 1.1rem 0; border-bottom: 1px solid var(--rule); }
.cmp__row--head { display: none; }
.cmp__k { font-family: var(--font-mono); font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink-faint); }
.cmp__a { color: var(--ink-faint); text-decoration: line-through; text-decoration-color: rgb(183 101 69 / 0.5); }
.cmp__b { font-family: var(--font-display); font-size: var(--step-2); line-height: 1.1; }
.who { background: var(--forest); color: var(--paper); }
.who .meta { color: var(--sage); }
.who__grid { display: grid; gap: 3rem; }
.who__card h3 { font-size: var(--step-3); margin: 1rem 0; }
.who__card p:last-child { color: rgb(244 240 231 / 0.75); max-width: 44ch; }
.terms__more { margin-top: 3rem; }
@media (min-width: 900px) {
  .cmp__row { grid-template-columns: 1fr 1.2fr 1.6fr; align-items: baseline; column-gap: var(--gutter); }
  .cmp__row--head { display: grid; border-bottom: 1px solid var(--rule-strong); }
  .who__grid { grid-template-columns: 1.2fr 1fr; column-gap: calc(var(--gutter) * 2); }
  .who__card--alt { margin-top: 8rem; }
}
</style>
