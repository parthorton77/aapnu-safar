<script setup lang="ts">
import { onMounted, ref } from 'vue'
import EditorialPhoto from '../editorial/EditorialPhoto.vue'
import { loadGsap, prefersReducedMotion } from '../../composables/motion'

const root = ref<HTMLElement | null>(null)

onMounted(async () => {
  if (prefersReducedMotion() || !root.value) return
  const { gsap } = await loadGsap()
  const el = root.value
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
  tl.from(el.querySelectorAll('.hero__line > span'), { yPercent: 105, duration: 1.2, stagger: 0.09 })
    .from(el.querySelector('.hero__photo'), { clipPath: 'inset(0 0 100% 0)', duration: 1.4, ease: 'power4.inOut' }, 0)
    .from(el.querySelectorAll('.hero__fade'), { opacity: 0, y: 14, duration: 0.9, stagger: 0.08 }, 0.5)
    .fromTo(el.querySelector('.hero__route path'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 2.2, ease: 'power2.inOut' }, 0.6)
    .from(el.querySelectorAll('.hero__pin'), { opacity: 0, y: 8, duration: 0.6, stagger: 1.2 }, 0.7)
})
</script>

<template>
  <section ref="root" class="hero" data-chapter="01" data-chapter-title="The journey begins" aria-labelledby="hero-title">
    <div class="frame hero__grid">
      <p class="meta hero__meta hero__fade">Route 01 <span aria-hidden="true">/</span> Your family journey</p>

      <h1 id="hero-title" class="hero__title">
        <span class="hero__line"><span>Take the</span></span>
        <span class="hero__line"><span class="italic">long way</span></span>
        <span class="hero__line"><span>home.</span></span>
      </h1>

      <div class="hero__photo">
        <EditorialPhoto photo="hero-expressway" ratio="4 / 5" priority sizes="(min-width: 900px) 52vw, 100vw" :label="''" credit="hidden" />
        <span class="hero__coord meta">22.30°N&nbsp;&nbsp;73.18°E</span>
        <!-- illustrated route annotation drawn over the photograph -->
        <svg class="hero__route" viewBox="0 0 400 500" preserveAspectRatio="none" aria-hidden="true">
          <path d="M60 470 C 120 400, 300 380, 250 300 S 150 180, 330 70" pathLength="1" />
        </svg>
        <span class="hero__pin hero__pin--a"><i /><span class="meta">Vadodara — Gujarat</span></span>
        <span class="hero__pin hero__pin--b"><i /><span class="meta">Ahmedabad · ≈110 km</span></span>
        <figure class="hero__inset hero__fade">
          <EditorialPhoto photo="vehicle-profile" ratio="5 / 4" sizes="(min-width: 900px) 20vw, 50vw" :label="''" credit="hidden" />
          <figcaption>
            <span class="meta meta--accent">Reserved</span>
            One vehicle and one driver, for your family alone.
          </figcaption>
        </figure>
      </div>

      <div class="hero__body">
        <p class="lede hero__fade">
          Exclusive family travel across Gujarat, thoughtfully planned around your people, your pace and your journey.
        </p>
        <div class="hero__ctas hero__fade">
          <RouterLink to="/plan-your-journey" class="cta cta--solid">Plan your journey <span class="cta__arrow" aria-hidden="true">→</span></RouterLink>
          <RouterLink :to="{ hash: '#how-it-works' }" class="cta">Discover how it works <span class="cta__arrow" aria-hidden="true">↓</span></RouterLink>
        </div>
      </div>


      <p class="hero__credit hero__fade">
        Photographs: Ridham Nagralawala (CC0), Ramakrishna Mission Vidyapith (public domain). <RouterLink to="/credits">Credits</RouterLink>
      </p>
    </div>
  </section>
</template>

<style scoped>
.hero { padding-top: clamp(1.5rem, 4vw, 3.5rem); padding-bottom: var(--section); position: relative; }
.hero__grid { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); column-gap: var(--gutter); position: relative; }
.hero__meta { grid-column: 1 / -1; margin-bottom: 1.4rem; }

.hero__title {
  grid-column: 1 / -1; grid-row: 2;
  font-size: var(--step-5); line-height: 0.86; letter-spacing: -0.025em;
  position: relative; z-index: 2;
}
.hero__line { display: block; overflow: hidden; padding-bottom: 0.06em; }
.hero__line > span { display: inline-block; }
.hero__line:nth-child(2) { padding-left: 0.9em; color: var(--forest); }

.hero__photo { grid-column: 1 / -1; grid-row: 3; margin-top: 2rem; position: relative; }
.hero__coord { position: absolute; right: 1rem; top: 1rem; color: var(--paper); text-shadow: 0 1px 8px rgb(0 0 0 / 0.5); }

/* route drawn over the photograph */
.hero__route { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
.hero__route path { fill: none; stroke: var(--paper); stroke-width: 2.4; stroke-dasharray: 1 1; stroke-linecap: round; vector-effect: non-scaling-stroke; filter: drop-shadow(0 1px 3px rgb(0 0 0 / 0.45)); }
.hero__pin { position: absolute; display: flex; align-items: center; gap: 0.55rem; transform: translate(-7px, -50%); }
.hero__pin i { width: 14px; height: 14px; border-radius: 50%; background: var(--terracotta); border: 3px solid var(--paper); box-shadow: 0 1px 6px rgb(0 0 0 / 0.4); flex: none; }
.hero__pin .meta { white-space: nowrap; color: var(--paper); text-shadow: 0 1px 8px rgb(0 0 0 / 0.6); background: rgb(36 37 31 / 0.35); padding: 0.2rem 0.4rem; }
.hero__pin--a { left: 15%; top: 94%; }
.hero__pin--b { left: 82.5%; top: 14%; flex-direction: row-reverse; transform: translate(calc(-100% + 7px), -50%); }
.hero__body { grid-column: 1 / -1; grid-row: 4; margin-top: 2rem; }
.hero__ctas { display: flex; flex-wrap: wrap; align-items: center; gap: 1.2rem 2rem; margin-top: 1.8rem; }
.hero__inset { display: none; }
.hero__credit { grid-column: 1 / -1; font-size: 0.68rem; color: var(--ink-faint); margin-top: 2.5rem; }
.hero__credit a { color: inherit; }

@media (min-width: 900px) {
  .hero__title { grid-column: 1 / 9; grid-row: 2 / 4; align-self: start; margin-top: 1rem; }
  .hero__photo { grid-column: 7 / 13; grid-row: 2 / 5; margin-top: 0; }
  .hero__body { grid-column: 1 / 6; grid-row: 4; align-self: end; margin-top: 0; }
  .hero__inset {
    display: block; position: absolute; z-index: 4; margin: 0;
    width: clamp(200px, 16vw, 260px); left: -3.5rem; bottom: -3rem;
    background: var(--paper); padding: 0.6rem 0.6rem 0.9rem; box-shadow: 0 18px 40px -22px rgb(36 37 31 / 0.55);
    transform: rotate(-2.2deg);
  }
  .hero__inset figcaption { font-size: 0.8rem; line-height: 1.4; padding-top: 0.6rem; color: var(--ink-soft); }
  .hero__inset figcaption .meta { display: block; margin-bottom: 0.25rem; }
  .hero__credit { grid-column: 7 / 13; margin-top: 1rem; text-align: right; }
}
@media (min-width: 1300px) {
  .hero__photo { grid-column: 7 / 12; }
}
</style>
