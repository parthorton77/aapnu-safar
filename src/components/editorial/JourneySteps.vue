<script setup lang="ts">
// The process drawn as a route-line diagram: five stations along one line.
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { processSteps } from '../../data/process'
import { loadGsap, prefersReducedMotion, vReveal } from '../../composables/motion'

const root = ref<HTMLElement | null>(null)
let kill: (() => void) | null = null

onMounted(async () => {
  if (prefersReducedMotion() || !root.value) return
  const { gsap } = await loadGsap()
  const line = root.value.querySelector('.steps__line-fill')
  const tween = gsap.fromTo(line, { scaleX: 0, scaleY: 0 }, {
    scaleX: 1, scaleY: 1, ease: 'none',
    scrollTrigger: { trigger: root.value, start: 'top 75%', end: 'bottom 60%', scrub: 0.5 },
  })
  kill = () => tween.kill()
})
onBeforeUnmount(() => kill?.())
</script>

<template>
  <div ref="root" class="steps">
    <div class="steps__line" aria-hidden="true"><span class="steps__line-fill" /></div>
    <ol class="steps__list">
      <li v-for="(s, i) in processSteps" :key="s.title" class="step" v-reveal="i * 0.07">
        <span class="step__station" aria-hidden="true" />
        <span class="step__no" aria-hidden="true">{{ i + 1 }}</span>
        <p class="meta step__tag">Stop {{ String(i + 1).padStart(2, '0') }} · {{ s.tag }}</p>
        <h3 class="step__title">{{ s.title }}</h3>
        <p class="step__text">{{ s.text }}</p>
      </li>
    </ol>
  </div>
</template>

<style scoped>
.steps { position: relative; }
.steps__line { position: absolute; left: 7px; top: 8px; bottom: 0; width: 2px; background: repeating-linear-gradient(var(--rule-strong) 0 6px, transparent 6px 12px); }
.steps__line-fill { position: absolute; inset: 0; background: var(--terracotta); transform-origin: top; }
.steps__list { list-style: none; margin: 0; padding: 0; display: grid; gap: 3rem; }
.step { position: relative; padding-left: 2.6rem; }
.step__station { position: absolute; left: 0; top: 0.3rem; width: 16px; height: 16px; border-radius: 50%; background: var(--paper); border: 2px solid var(--ink); }
.step__no { position: absolute; right: 0; top: -1.4rem; font-family: var(--font-display); font-size: 5.5rem; line-height: 1; color: var(--paper-shade); z-index: -1; }
.step__title { font-size: var(--step-2); margin: 0.5rem 0 0.6rem; }
.step__text { color: var(--ink-soft); font-size: var(--step--1); max-width: 32ch; }

@media (min-width: 900px) {
  .steps__line { left: 0; right: 0; top: 7px; bottom: auto; width: auto; height: 2px; background: repeating-linear-gradient(90deg, var(--rule-strong) 0 6px, transparent 6px 12px); }
  .steps__line-fill { transform-origin: left; }
  .steps__list { grid-template-columns: repeat(5, minmax(0, 1fr)); gap: var(--gutter); }
  .step { padding-left: 0; padding-top: 2.4rem; }
  .step:nth-child(even) { margin-top: 3.5rem; }
  .step__station { top: 0; }
  .step:nth-child(even) .step__station { top: -3.5rem; }
  .step__no { right: auto; left: 0; top: auto; bottom: -1rem; font-size: 7rem; opacity: 0.9; }
}
</style>
