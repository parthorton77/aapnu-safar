<script setup lang="ts">
// Atlas + destination panel. On desktop the map is sticky inside a tall section and
// scroll draws the route, then zooms into the corridor. On mobile it simply draws once.
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import GujaratAtlas from './GujaratAtlas.vue'
import EditorialPhoto from '../editorial/EditorialPhoto.vue'
import { places, placeById } from '../../data/places'
import { loadGsap, prefersReducedMotion } from '../../composables/motion'

const props = withDefaults(defineProps<{ scrollDriven?: boolean; initial?: string | null }>(), { scrollDriven: true, initial: null })

const root = ref<HTMLElement | null>(null)
const progress = ref(prefersReducedMotion() ? 1 : 0)
const zoom = ref(prefersReducedMotion() ? 1 : 0)
const active = ref<string | null>(props.initial)
const place = computed(() => (active.value ? placeById[active.value] : null))
const isDesktop = ref(false)

let kill: (() => void) | null = null

onMounted(async () => {
  isDesktop.value = window.matchMedia('(min-width: 900px)').matches
  if (prefersReducedMotion() || !root.value) return
  const { gsap, ScrollTrigger } = await loadGsap()
  if (props.scrollDriven && isDesktop.value) {
    const st = ScrollTrigger.create({
      trigger: root.value, start: 'top top', end: 'bottom bottom', scrub: 0.6,
      onUpdate: self => {
        const p = self.progress
        progress.value = Math.min(1, p / 0.55)
        zoom.value = Math.max(0, Math.min(1, (p - 0.4) / 0.35))
      },
    })
    kill = () => st.kill()
  } else {
    const state = { p: 0, z: 0 }
    const tween = gsap.to(state, {
      p: 1, z: 1, duration: 2.6, ease: 'power2.inOut',
      scrollTrigger: { trigger: root.value, start: 'top 70%', once: true },
      onUpdate: () => { progress.value = state.p; zoom.value = Math.max(0, state.z * 1.4 - 0.4) },
    })
    kill = () => tween.kill()
  }
})
onBeforeUnmount(() => kill?.())
</script>

<template>
  <div ref="root" class="explorer" :class="{ 'is-scroll': scrollDriven }">
    <div class="explorer__sticky">
      <div class="explorer__plate">
        <div class="explorer__head">
          <span class="meta">Plate I — The service corridor</span>
          <span class="meta">Ahmedabad ↔ Surat · Ekta Nagar</span>
        </div>
        <GujaratAtlas v-model:active="active" :progress="progress" :zoom="zoom" />
        <p class="meta explorer__help">Select a place on the map, or tab to it and use the arrow keys to follow the route.</p>
      </div>

      <aside class="explorer__panel" aria-live="polite">
        <Transition name="panel" mode="out-in">
          <div v-if="place" :key="place.id" class="panel">
            <EditorialPhoto :photo="place.photo" ratio="16 / 10" sizes="(min-width: 900px) 26vw, 90vw" :label="''" credit="hidden" />
            <p class="meta meta--accent panel__note">{{ place.note }}</p>
            <h3 class="panel__name">{{ place.name }} <span class="panel__gu" lang="gu">{{ place.gujarati }}</span></h3>
            <p class="panel__text">{{ place.summary }}</p>
            <RouterLink :to="{ path: '/plan-your-journey', query: { add: place.id } }" class="cta">
              Add {{ place.name }} to my journey <span class="cta__arrow" aria-hidden="true">→</span>
            </RouterLink>
          </div>
          <div v-else class="panel panel--empty">
            <p class="meta">Eight places, one corridor</p>
            <ul class="panel__list">
              <li v-for="p in places" :key="p.id">
                <button type="button" @click="active = p.id">{{ p.name }} <span class="meta">{{ p.note }}</span></button>
              </li>
            </ul>
          </div>
        </Transition>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.explorer__sticky { display: grid; gap: 2rem; }
.explorer__plate { background: var(--paper); border: 1px solid var(--rule-strong); padding: 0.75rem; position: relative; }
.explorer__plate::before { content: ''; position: absolute; inset: 5px; border: 1px solid var(--rule); pointer-events: none; }
.explorer__head { display: flex; justify-content: space-between; gap: 1rem; padding: 0.4rem 0.5rem 0.7rem; flex-wrap: wrap; }
.explorer__help { padding: 0.6rem 0.5rem 0.2rem; font-size: 0.6rem; }

.panel__note { margin: 1rem 0 0.3rem; }
.panel__name { font-size: var(--step-3); }
.panel__gu { font-family: 'Noto Serif Gujarati', serif; font-size: 0.42em; color: var(--ink-soft); vertical-align: middle; }
.panel__text { color: var(--ink-soft); margin: 0.9rem 0 1.2rem; max-width: 40ch; }
.panel__list { list-style: none; padding: 0; margin: 1rem 0 0; border-top: 1px solid var(--rule); }
.panel__list button {
  width: 100%; display: flex; justify-content: space-between; align-items: baseline; gap: 1rem;
  background: none; border: 0; border-bottom: 1px solid var(--rule); padding: 0.7rem 0; text-align: left; cursor: pointer;
  font-family: var(--font-display); font-size: 1.45rem;
}
.panel__list button:hover { color: var(--terracotta-ink); }
.panel__list .meta { font-size: 0.58rem; text-align: right; }
.panel-enter-active, .panel-leave-active { transition: opacity 0.3s, transform 0.4s var(--ease-out); }
.panel-enter-from { opacity: 0; transform: translateY(10px); }
.panel-leave-to { opacity: 0; }

@media (min-width: 900px) {
  .explorer.is-scroll { height: 260vh; }
  .explorer__sticky { position: sticky; top: 5.5rem; grid-template-columns: minmax(0, 2.2fr) minmax(260px, 1fr); align-items: start; }
  .explorer.is-scroll .explorer__plate { max-height: calc(100vh - 7rem); }
  .explorer.is-scroll .explorer__plate :deep(.atlas) { max-height: calc(100vh - 12rem); }
}
</style>
