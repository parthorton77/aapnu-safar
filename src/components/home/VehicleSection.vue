<script setup lang="ts">
// The vehicle. Photo-led for now; a Three.js scene can replace the photo later in the slot marked below.
import EditorialPhoto from '../editorial/EditorialPhoto.vue'
import { vReveal } from '../../composables/motion'

const notes = [
  { k: 'Seating', v: 'Family-oriented MPV seating across three rows, with the layout planned around your passenger count.' },
  { k: 'Luggage', v: 'Space depends on how many people are travelling and how the seats are set. Tell us what you are bringing and we will advise honestly.' },
  { k: 'Journeys', v: 'Suited to planned city days and intercity travel along the corridor.' },
  { k: 'Before you book', v: 'Vehicle details, including registration, are confirmed with you before your booking is final.' },
]
</script>

<template>
  <section class="veh" data-chapter="05" data-chapter-title="The vehicle" aria-labelledby="veh-title">
    <div class="veh__grid">
      <!-- 3D-SCENE SLOT: a future Three.js vehicle scene mounts here, with this photo kept as its static fallback. -->
      <div class="veh__photo" v-reveal>
        <EditorialPhoto photo="vehicle-profile" ratio="5 / 4" :parallax="0.08" sizes="(min-width: 900px) 58vw, 100vw" :label="''" credit="hidden" />
        <svg class="veh__callouts" viewBox="0 0 500 400" preserveAspectRatio="none" aria-hidden="true">
          <path d="M150 105 L150 40 L230 40" /><circle cx="150" cy="105" r="4" />
          <path d="M270 120 L330 60 L420 60" /><circle cx="270" cy="120" r="4" />
        </svg>
        <span class="veh__tag veh__tag--a meta">Rows 2 &amp; 3 · family seating</span>
        <span class="veh__tag veh__tag--b meta">Your driver · same for the trip</span>
      </div>

      <div class="veh__text frame-inner">
        <p class="meta" v-reveal>05 — The vehicle</p>
        <h2 id="veh-title" class="veh__title" v-reveal>
          <span class="italic">Room for</span><br />everyone<br />who matters.
        </h2>
        <p class="veh__model" v-reveal><span class="meta meta--accent">Initial vehicle</span> Maruti Suzuki Ertiga</p>
        <dl class="veh__notes">
          <div v-for="(n, i) in notes" :key="n.k" v-reveal="i * 0.06">
            <dt class="meta">{{ n.k }}</dt>
            <dd>{{ n.v }}</dd>
          </div>
        </dl>
        <p class="veh__credit">
          The photograph shows the model, not a specific Aapnu Safar vehicle. Photo: Ramakrishna Mission Vidyapith, public domain.
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.veh { padding-block: var(--section); }
.veh__grid { display: grid; gap: 2.5rem; padding-left: var(--spine); }
.veh__photo { position: relative; }
.veh__callouts { display: none; }
.veh__tag { display: none; }
.frame-inner { padding-inline: var(--gutter); }
.veh__title { font-size: var(--step-4); margin: 1.2rem 0 2rem; }
.veh__title .italic { color: var(--terracotta-ink); }
.veh__model { font-family: var(--font-display); font-size: var(--step-2); display: flex; flex-direction: column; gap: 0.3rem; margin-bottom: 1.6rem; }
.veh__notes { margin: 0; border-top: 1px solid var(--rule-strong); }
.veh__notes div { display: grid; grid-template-columns: 8.5rem 1fr; gap: 1rem; padding: 0.95rem 0; border-bottom: 1px solid var(--rule); }
.veh__notes dd { margin: 0; font-size: var(--step--1); color: var(--ink-soft); }
.veh__credit { font-size: 0.68rem; color: var(--ink-faint); margin-top: 1.2rem; max-width: 50ch; }

@media (min-width: 900px) {
  .veh__grid { grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr); align-items: center; gap: 0; }
  .veh__photo { margin-left: calc(var(--spine) * -1); }
  .frame-inner { padding-inline: calc(var(--gutter) * 1.5) var(--gutter); max-width: 620px; }
  .veh__callouts { display: block; position: absolute; inset: 0; width: 100%; height: 100%; }
  .veh__callouts path { fill: none; stroke: var(--paper); stroke-width: 1.2; vector-effect: non-scaling-stroke; }
  .veh__callouts circle { fill: var(--terracotta); stroke: var(--paper); stroke-width: 2; vector-effect: non-scaling-stroke; }
  .veh__tag { display: block; position: absolute; color: var(--paper); background: rgb(36 37 31 / 0.55); padding: 0.3rem 0.5rem; font-size: 0.6rem; }
  .veh__tag--a { left: 47%; top: 6.5%; }
  .veh__tag--b { left: 84%; top: 11.5%; white-space: nowrap; transform: translateX(-30%); }
}
</style>
