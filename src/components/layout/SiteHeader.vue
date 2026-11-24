<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { navLinks } from '../navigation/nav'
import { useScrollProgress } from '../../composables/useScrollProgress'

const open = ref(false)
const scrolled = ref(false)
const route = useRoute()
const toggle = ref<HTMLButtonElement | null>(null)
const firstLink = ref<HTMLElement | null>(null)
const { progress } = useScrollProgress()

watch(() => route.fullPath, () => { open.value = false })
watch(open, async v => {
  document.body.style.overflow = v ? 'hidden' : ''
  if (v) { await nextTick(); firstLink.value?.focus() }
})

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && open.value) { open.value = false; toggle.value?.focus() }
}
const onScroll = () => { scrolled.value = window.scrollY > 40 }
onMounted(() => { window.addEventListener('keydown', onKey); window.addEventListener('scroll', onScroll, { passive: true }); onScroll() })
onBeforeUnmount(() => { window.removeEventListener('keydown', onKey); window.removeEventListener('scroll', onScroll) })
</script>

<template>
  <header class="header" :class="{ 'is-scrolled': scrolled, 'is-open': open }">
    <div class="header__bar frame">
      <RouterLink to="/" class="brand" aria-label="Aapnu Safar — home">
        <svg class="brand__mark" viewBox="0 0 40 40" aria-hidden="true">
          <path d="M6 32 C 14 26, 10 16, 20 14 S 30 8, 33 6" />
          <circle cx="6" cy="32" r="3" /><circle cx="33" cy="6" r="3.6" class="end" />
        </svg>
        <span class="brand__name">Aapnu&nbsp;Safar</span>
      </RouterLink>

      <nav class="nav" aria-label="Main">
        <RouterLink v-for="l in navLinks" :key="l.to" :to="l.to" class="nav__link">{{ l.label }}</RouterLink>
      </nav>

      <RouterLink to="/plan-your-journey" class="cta cta--solid header__cta">
        Plan your journey <span class="cta__arrow" aria-hidden="true">→</span>
      </RouterLink>

      <button ref="toggle" class="menu-btn" type="button" :aria-expanded="open" aria-controls="mobile-menu" @click="open = !open">
        <span class="visually-hidden">{{ open ? 'Close menu' : 'Open menu' }}</span>
        <span class="menu-btn__lines" aria-hidden="true"><i /><i /></span>
        <span class="meta" aria-hidden="true">{{ open ? 'Close' : 'Menu' }}</span>
      </button>
    </div>
    <!-- mobile route-progress: the journey so far -->
    <div class="progress" aria-hidden="true"><span :style="{ transform: `scaleX(${progress})` }" /></div>

    <div v-show="open" id="mobile-menu" class="drawer">
      <nav aria-label="Main (mobile)" class="drawer__nav">
        <RouterLink ref="firstLink" to="/" class="drawer__link"><span class="meta">01</span>Home</RouterLink>
        <RouterLink v-for="l in navLinks" :key="l.to" :to="l.to" class="drawer__link"><span class="meta">{{ l.no }}</span>{{ l.label }}</RouterLink>
      </nav>
      <RouterLink to="/plan-your-journey" class="cta cta--solid drawer__cta">Plan your journey <span class="cta__arrow" aria-hidden="true">→</span></RouterLink>
      <p class="meta drawer__foot">Surat · Bharuch · Vadodara · Anand · Nadiad · Ahmedabad · Ekta Nagar</p>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: sticky; top: 0; z-index: 50;
  background: color-mix(in srgb, var(--paper) 92%, transparent);
  backdrop-filter: blur(6px);
  transition: box-shadow 0.4s;
}
.header.is-scrolled { box-shadow: 0 1px 0 var(--rule); }
.header__bar { display: flex; align-items: center; gap: 2rem; min-height: 4.5rem; }
.brand { display: flex; align-items: center; gap: 0.6rem; text-decoration: none; margin-right: auto; }
.brand__mark { width: 30px; height: 30px; }
.brand__mark path { fill: none; stroke: var(--forest); stroke-width: 2; stroke-dasharray: 3 3.4; stroke-linecap: round; }
.brand__mark circle { fill: var(--mustard); }
.brand__mark .end { fill: var(--terracotta); }
.brand__name { font-family: var(--font-display); font-size: 1.65rem; line-height: 1; letter-spacing: -0.01em; }

.nav { display: none; gap: 1.6rem; }
.nav__link { font-size: 0.92rem; font-weight: 500; text-decoration: none; color: var(--ink-soft); padding: 0.4rem 0; border-bottom: 1px solid transparent; transition: color 0.3s, border-color 0.3s; }
.nav__link:hover, .nav__link.router-link-active { color: var(--ink); border-bottom-color: var(--terracotta); }
.header__cta { display: none; font-size: 0.92rem; padding: 0.7rem 1.1rem 0.65rem; }
.header__cta::after { right: 2.4rem; }

.menu-btn { display: flex; align-items: center; gap: 0.6rem; background: none; border: 0; padding: 0.5rem 0; cursor: pointer; }
.menu-btn__lines { display: grid; gap: 6px; width: 24px; }
.menu-btn__lines i { display: block; height: 1.5px; background: var(--ink); transition: transform 0.35s var(--ease-out); }
.is-open .menu-btn__lines i:first-child { transform: translateY(3.75px) rotate(45deg); }
.is-open .menu-btn__lines i:last-child { transform: translateY(-3.75px) rotate(-45deg); }

.progress { height: 2px; }
.progress span { display: block; height: 100%; background: var(--terracotta); transform-origin: left; }

.drawer { position: fixed; inset: 4.6rem 0 0; background: var(--paper); padding: 2rem var(--gutter) 3rem; display: flex; flex-direction: column; gap: 2rem; overflow-y: auto; }
.drawer__nav { display: grid; }
.drawer__link { display: flex; align-items: baseline; gap: 1rem; font-family: var(--font-display); font-size: 2.4rem; line-height: 1.15; text-decoration: none; padding: 0.35rem 0; border-bottom: 1px solid var(--rule); }
.drawer__link.router-link-exact-active { color: var(--terracotta-ink); }
.drawer__cta { align-self: flex-start; }
.drawer__foot { margin-top: auto; }

@media (min-width: 1100px) {
  .nav, .header__cta { display: flex; }
  .menu-btn, .drawer { display: none !important; }
  .progress { display: none; }
}
</style>
