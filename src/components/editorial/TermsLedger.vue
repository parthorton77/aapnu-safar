<script setup lang="ts">
// Commercial terms as a ledger. Unconfirmed specifics are visibly marked, never invented.
import { terms } from '../../config/business'
import TbcValue from '../common/TbcValue.vue'
import { vReveal } from '../../composables/motion'
const props = defineProps<{ only?: string[] }>()
const rows = props.only ? terms.filter(t => props.only!.includes(t.id)) : terms
</script>

<template>
  <dl class="ledger">
    <div v-for="(t, i) in rows" :key="t.id" class="ledger__row" v-reveal="i * 0.04">
      <dt>
        <span class="meta">§ {{ String(i + 1).padStart(2, '0') }}</span>
        <span class="ledger__t">{{ t.title }}</span>
      </dt>
      <dd>
        <p>{{ t.how }}</p>
        <p v-if="t.detail.tbc || t.detail.value" class="ledger__detail"><span class="meta">Specifics</span> <TbcValue :detail="t.detail" /></p>
      </dd>
    </div>
  </dl>
</template>

<style scoped>
.ledger { margin: 0; border-top: 1px solid var(--rule-strong); }
.ledger__row { display: grid; gap: 0.6rem; padding: 1.4rem 0; border-bottom: 1px solid var(--rule); }
dt { display: flex; flex-direction: column; gap: 0.3rem; }
.ledger__t { font-family: var(--font-display); font-size: var(--step-2); line-height: 1.05; }
dd { margin: 0; color: var(--ink-soft); max-width: 56ch; }
dd p { margin: 0; }
.ledger__detail { margin-top: 0.7rem !important; font-size: 0.9rem; display: flex; gap: 0.8rem; align-items: baseline; }
@media (min-width: 900px) { .ledger__row { grid-template-columns: minmax(0, 1fr) minmax(0, 1.3fr); column-gap: var(--gutter); } }
</style>
