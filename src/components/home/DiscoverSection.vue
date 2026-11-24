<script setup lang="ts">
import EditorialPhoto from '../editorial/EditorialPhoto.vue'
import { vReveal } from '../../composables/motion'
</script>

<template>
  <section class="disc" data-chapter="07" data-chapter-title="Discover Gujarat" aria-labelledby="disc-title">
    <div class="frame disc__grid">
      <header class="disc__head">
        <p class="meta" v-reveal>07 — Discover Gujarat</p>
        <h2 id="disc-title" class="disc__title" v-reveal>Places <span class="italic">worth the detour.</span></h2>
      </header>

      <article class="disc__item disc__item--ekta" v-reveal>
        <EditorialPhoto photo="ekta-sunrise" ratio="3 / 4" :parallax="0.1" sizes="(min-width: 900px) 38vw, 92vw" />
        <h3>Ekta Nagar</h3>
        <p>The Statue of Unity rises over the Narmada. Many families plan it as a full day out from Vadodara, with time to rest along the way.</p>
      </article>

      <article class="disc__item disc__item--jali" v-reveal="0.08">
        <EditorialPhoto photo="ahmedabad-jali" ratio="1 / 1" sizes="(min-width: 900px) 26vw, 92vw" />
        <h3>Ahmedabad</h3>
        <p>The stone tree of life at Sidi Saiyyed, a few lanes from the pols of the old city.</p>
      </article>

      <blockquote class="disc__quote" v-reveal>
        <p>“Arrive, rest, and then go and see the places you heard about as a child.”</p>
        <footer class="meta">— The idea behind Aapnu Safar</footer>
      </blockquote>

      <article class="disc__item disc__item--palace" v-reveal>
        <EditorialPhoto photo="vadodara-palace" ratio="16 / 9" sizes="(min-width: 900px) 52vw, 92vw" />
        <h3>Vadodara</h3>
        <p>Laxmi Vilas Palace, the old Gaekwad capital, and the junction where the corridor turns east.</p>
      </article>

      <article class="disc__item disc__item--surat" v-reveal="0.08">
        <EditorialPhoto photo="surat-skyline" ratio="4 / 5" sizes="(min-width: 900px) 24vw, 92vw" />
        <h3>Surat</h3>
        <p>The southern end of the corridor, on the Tapi.</p>
      </article>

      <p class="disc__more" v-reveal>
        <RouterLink to="/discover-gujarat" class="cta">Explore every place on the corridor <span class="cta__arrow" aria-hidden="true">→</span></RouterLink>
      </p>
    </div>
  </section>
</template>

<style scoped>
.disc { padding-block: var(--section); border-top: 1px solid var(--rule); }
.disc__grid { display: grid; gap: 3rem; grid-template-columns: minmax(0, 1fr); }
.disc__title { font-size: var(--step-4); margin-top: 1rem; }
.disc__title .italic { color: var(--forest); }
.disc__item h3 { font-size: var(--step-2); margin: 1rem 0 0.4rem; }
.disc__item p { color: var(--ink-soft); font-size: var(--step--1); max-width: 40ch; }
.disc__quote { margin: 0; padding: 0; }
.disc__quote p { font-family: var(--font-display); font-style: italic; font-size: var(--step-2); line-height: 1.15; color: var(--terracotta-ink); max-width: 18ch; }

@media (min-width: 900px) {
  .disc__grid { grid-template-columns: repeat(12, minmax(0, 1fr)); column-gap: var(--gutter); row-gap: 4rem; }
  .disc__head { grid-column: 1 / 8; }
  .disc__item--ekta { grid-column: 1 / 6; grid-row: 2 / 4; }
  .disc__item--jali { grid-column: 7 / 11; grid-row: 2; margin-top: 6rem; }
  .disc__quote { grid-column: 7 / 13; grid-row: 3; align-self: center; padding-left: 2rem; border-left: 1px solid var(--rule-strong); }
  .disc__item--palace { grid-column: 3 / 10; grid-row: 4; }
  .disc__item--surat { grid-column: 10 / 13; grid-row: 4; margin-top: 10rem; }
  .disc__more { grid-column: 3 / 13; }
}
</style>
