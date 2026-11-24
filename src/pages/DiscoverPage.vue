<script setup lang="ts">
import PageHeader from '../components/editorial/PageHeader.vue'
import AtlasExplorer from '../components/map/AtlasExplorer.vue'
import EditorialPhoto from '../components/editorial/EditorialPhoto.vue'
import ClosingStatement from '../components/editorial/ClosingStatement.vue'
import { places } from '../data/places'
import type { PhotoKey } from '../data/photos'
import { vReveal } from '../composables/motion'

// Additional photographs per place for the long-form chapters.
const extra: Partial<Record<string, PhotoKey[]>> = {
  ahmedabad: ['ahmedabad-pol', 'ahmedabad-adalaj', 'ahmedabad-riverfront'],
  vadodara: ['vadodara-panorama'],
  'ekta-nagar': ['ekta-river'],
}
const ROUTE_KM: Record<string, string> = { ahmedabad: 'KM 0', nadiad: 'KM ≈55', anand: 'KM ≈75', vadodara: 'KM ≈115', 'ekta-nagar': 'VADODARA +≈90', bharuch: 'KM ≈190', ankleshwar: 'KM ≈200', surat: 'KM ≈265' }
</script>

<template>
  <div>
    <PageHeader no="04" kicker="Discover Gujarat" lede="The corridor we serve runs from Ahmedabad to Surat, with a detour east to Ekta Nagar. These are its places, in the order you meet them on the road.">
      Gujarat, <span class="italic">stop by stop.</span>
    </PageHeader>

    <section class="atlas-sec" data-chapter="04.1" data-chapter-title="The atlas">
      <div class="frame">
        <AtlasExplorer :scroll-driven="false" />
        <p class="atlas-sec__note meta">Distances are approximate road kilometres, for orientation only. Every journey is subject to itinerary review and availability.</p>
      </div>
    </section>

    <article
      v-for="(p, i) in places" :key="p.id" :id="p.id"
      class="place" :class="[`place--${i % 3}`]"
      :data-chapter="`04.${i + 2}`" :data-chapter-title="p.name"
    >
      <div class="frame place__grid">
        <header class="place__head">
          <p class="meta meta--accent" v-reveal>{{ ROUTE_KM[p.id] }} · {{ p.note }}</p>
          <h2 class="place__name" v-reveal>{{ p.name }} <span class="place__gu" lang="gu">{{ p.gujarati }}</span></h2>
          <p class="place__text" v-reveal>{{ p.summary }}</p>
          <RouterLink :to="{ path: '/plan-your-journey', query: { add: p.id } }" class="cta" v-reveal>Add {{ p.name }} to my journey <span class="cta__arrow" aria-hidden="true">→</span></RouterLink>
        </header>
        <div class="place__main" v-reveal>
          <EditorialPhoto :photo="p.photo" :ratio="i % 3 === 1 ? '4 / 5' : '3 / 2'" :parallax="0.08" sizes="(min-width: 900px) 55vw, 92vw" />
        </div>
        <div v-if="extra[p.id]" class="place__extra">
          <EditorialPhoto v-for="(k, j) in extra[p.id]" :key="k" :photo="k" :ratio="j % 2 ? '1 / 1' : '4 / 5'" sizes="(min-width: 900px) 24vw, 46vw" v-reveal="j * 0.08" />
        </div>
      </div>
    </article>

    <ClosingStatement chapter="04.10" />
  </div>
</template>

<style scoped>
.atlas-sec { padding-block: var(--section); }
.atlas-sec__note { margin-top: 1.2rem; }
.place { padding-block: calc(var(--section) * 0.8); border-top: 1px solid var(--rule); scroll-margin-top: 5rem; }
.place__grid { display: grid; gap: 2rem; grid-template-columns: minmax(0, 1fr); }
.place__name { font-size: var(--step-4); margin: 0.8rem 0 1rem; }
.place__gu { font-family: 'Noto Serif Gujarati', serif; font-size: 0.35em; color: var(--ink-soft); vertical-align: middle; }
.place__text { color: var(--ink-soft); max-width: 42ch; margin-bottom: 1.4rem; }
.place__extra { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
@media (min-width: 900px) {
  .place__grid { grid-template-columns: repeat(12, minmax(0, 1fr)); column-gap: var(--gutter); row-gap: 3rem; }
  .place--0 .place__head { grid-column: 1 / 5; align-self: end; }
  .place--0 .place__main { grid-column: 5 / 13; grid-row: 1; }
  .place--1 .place__head { grid-column: 8 / 13; align-self: center; }
  .place--1 .place__main { grid-column: 2 / 7; grid-row: 1; }
  .place--2 .place__head { grid-column: 1 / 6; }
  .place--2 .place__main { grid-column: 4 / 12; }
  .place__extra { grid-column: 3 / 13; grid-template-columns: repeat(3, 1fr); align-items: start; }
  .place__extra > :nth-child(2) { margin-top: 4rem; }
}
</style>
