<script setup lang="ts">
import SiteHeader from './components/layout/SiteHeader.vue'
import SiteFooter from './components/layout/SiteFooter.vue'
import RouteSpine from './components/layout/RouteSpine.vue'
import { loadGsap } from './composables/motion'

// Layout changes after a page swap, so scroll-linked animations re-measure.
const refresh = () => loadGsap().then(({ ScrollTrigger }) => ScrollTrigger.refresh())
</script>

<template>
  <a href="#main" class="skip-link">Skip to content</a>
  <SiteHeader />
  <RouteSpine />
  <main id="main" tabindex="-1">
    <RouterView v-slot="{ Component, route }">
      <Transition name="page" mode="out-in" @after-enter="refresh">
        <component :is="Component" :key="route.path" />
      </Transition>
    </RouterView>
  </main>
  <SiteFooter />
</template>

<style>
main:focus { outline: none; }
.page-enter-active, .page-leave-active { transition: opacity 0.35s ease, transform 0.45s var(--ease-out); }
.page-enter-from { opacity: 0; transform: translateY(12px); }
.page-leave-to { opacity: 0; }
</style>
