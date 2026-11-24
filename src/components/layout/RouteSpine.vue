<script setup lang="ts">
// The margin route: a small Ahmedabad → Surat corridor that draws itself as the page scrolls,
// with the current chapter number beneath it. Desktop only; mobile gets the header progress bar.
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { corridorPath, spurPath, markers, CORRIDOR_BOX } from '../map/routes'
import { useScrollProgress } from '../../composables/useScrollProgress'

const { progress, refresh } = useScrollProgress()
const route = useRoute()
const chapter = ref<{ no: string; title: string } | null>(null)
const pathEl = ref<SVGPathElement | null>(null)
const car = ref<[number, number]>([0, 0])

let io: IntersectionObserver | null = null
function observe() {
  io?.disconnect()
  chapter.value = null
  io = new IntersectionObserver(entries => {
    for (const e of entries) {
      if (e.isIntersecting) {
        const el = e.target as HTMLElement
        chapter.value = { no: el.dataset.chapter ?? '', title: el.dataset.chapterTitle ?? '' }
      }
    }
  }, { rootMargin: '-45% 0px -50% 0px' })
  document.querySelectorAll('[data-chapter]').forEach(el => io!.observe(el))
}

watch(progress, p => {
  const el = pathEl.value
  if (!el) return
  const pt = el.getPointAtLength(el.getTotalLength() * p)
  car.value = [pt.x, pt.y]
})

onMounted(() => { setTimeout(observe, 50) })
watch(() => route.path, () => setTimeout(() => { observe(); refresh() }, 120))
onBeforeUnmount(() => io?.disconnect())

const pad = 14
const box = `${CORRIDOR_BOX.x - pad} ${CORRIDOR_BOX.y - pad} ${CORRIDOR_BOX.w * 0.78 + pad * 2} ${CORRIDOR_BOX.h + pad * 2}`
</script>

<template>
  <aside class="spine" aria-hidden="true">
    <svg class="spine__map" :viewBox="box" preserveAspectRatio="xMidYMin meet">
      <path class="base" :d="corridorPath" />
      <path class="base base--minor" :d="spurPath" />
      <path ref="pathEl" class="drawn" :d="corridorPath" pathLength="1" :style="{ strokeDashoffset: 1 - progress }" />
      <circle v-for="m in markers" :key="m.id" :cx="m.xy[0]" :cy="m.xy[1]" r="14" class="stop" />
      <circle :cx="car[0]" :cy="car[1]" r="26" class="car" />
    </svg>
    <div class="spine__labels">
      <span class="meta">AMD</span>
      <span class="meta">STV</span>
    </div>
    <Transition name="ch" mode="out-in">
      <div v-if="chapter" :key="chapter.no" class="spine__chapter">
        <span class="spine__no">{{ chapter.no }}</span>
        <span class="spine__title meta">{{ chapter.title }}</span>
      </div>
    </Transition>
  </aside>
</template>

<style scoped>
.spine { display: none; }
@media (min-width: 1100px) {
  .spine {
    display: flex; flex-direction: column; align-items: center;
    position: fixed; left: 0; top: 4.6rem; bottom: 0; width: var(--spine); z-index: 40;
    padding: 1.6rem 0 1.6rem; border-right: 1px solid var(--rule);
    background: var(--paper);
  }
}
.spine__map { width: 56px; height: 34vh; overflow: visible; }
.base { fill: none; stroke: var(--ink); stroke-opacity: 0.3; stroke-width: 9; stroke-dasharray: 22 22; }
.base--minor { stroke-width: 7; }
.drawn { fill: none; stroke: var(--terracotta); stroke-width: 14; stroke-dasharray: 1 1; stroke-linecap: round; }
.stop { fill: var(--paper); stroke: var(--ink); stroke-width: 6; }
.car { fill: var(--forest); stroke: var(--paper); stroke-width: 8; }
.spine__labels { display: flex; justify-content: space-between; width: 56px; margin-top: 0.4rem; }
.spine__labels .meta { font-size: 0.55rem; }
.spine__chapter { margin-top: auto; display: flex; flex-direction: column; align-items: center; gap: 1rem; }
.spine__no { font-family: var(--font-display); font-size: 2.4rem; line-height: 1; color: var(--terracotta-ink); }
.spine__title { writing-mode: vertical-rl; transform: rotate(180deg); max-height: 30vh; overflow: hidden; white-space: nowrap; font-size: 0.62rem; }
.ch-enter-active, .ch-leave-active { transition: opacity 0.35s, transform 0.35s var(--ease-out); }
.ch-enter-from { opacity: 0; transform: translateY(8px); }
.ch-leave-to { opacity: 0; transform: translateY(-8px); }
</style>
