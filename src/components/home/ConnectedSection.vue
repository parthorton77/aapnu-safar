<script setup lang="ts">
import AtlasExplorer from '../map/AtlasExplorer.vue'
import { vReveal } from '../../composables/motion'
</script>

<template>
  <section id="gujarat-connected" class="conn" data-chapter="03" data-chapter-title="Gujarat, connected" aria-labelledby="conn-title">
    <div class="frame">
      <header class="conn__head">
        <p class="meta" v-reveal>03 — Gujarat, connected</p>
        <h2 id="conn-title" class="conn__title" v-reveal>
          From familiar streets <br /><span class="italic">to unforgettable detours.</span>
        </h2>
        <div class="conn__aside" v-reveal="0.1">
          <p>
            From airport arrivals and family visits to heritage destinations and the Statue of Unity, your journey is
            planned around the places that matter to you.
          </p>
          <p class="conn__note">
            <span class="meta meta--accent">Please note</span>
            Every journey is subject to itinerary review and availability. A place on this map is not an automatic
            booking. Places outside the corridor can be requested and are reviewed individually.
          </p>
        </div>
      </header>
      <AtlasExplorer />
    </div>
  </section>
</template>

<style scoped>
.conn { padding-block: var(--section) calc(var(--section) * 0.6); background: linear-gradient(var(--paper), var(--paper-deep) 30%, var(--paper-deep) 80%, var(--paper)); }
.conn__head { display: grid; gap: 1.6rem; margin-bottom: 3rem; }
.conn__title { font-size: var(--step-4); }
.conn__title .italic { color: var(--forest); }
.conn__aside { color: var(--ink-soft); max-width: 46ch; }
.conn__note { font-size: var(--step--1); border-left: 2px solid var(--terracotta); padding-left: 1rem; margin-top: 1.4rem; }
.conn__note .meta { display: block; margin-bottom: 0.3rem; }
@media (min-width: 900px) {
  .conn__head { grid-template-columns: 1.5fr 1fr; align-items: end; column-gap: var(--gutter); }
  .conn__head > .meta { grid-column: 1 / -1; }
}
</style>
