<script setup lang="ts">
// Shows a business detail, or a clearly marked placeholder when it is not yet confirmed.
import type { Detail } from '../../config/business'
defineProps<{ detail: Detail; href?: string }>()
</script>

<template>
  <span v-if="detail.tbc || !detail.value" class="tbc">[To be confirmed]</span>
  <a v-else-if="href" :href="href">{{ detail.value }}</a>
  <span v-else>{{ detail.value }}</span>
</template>

<style scoped>
.tbc {
  font-family: var(--font-mono); font-size: 0.78em; letter-spacing: 0.04em;
  color: var(--terracotta-ink); background: color-mix(in srgb, var(--mustard) 22%, transparent);
  padding: 0.05em 0.35em; border-radius: 2px; white-space: nowrap;
}
</style>
