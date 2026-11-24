<script setup lang="ts">
// Label + control + hint + error, wired with ids for screen readers.
// The slot receives { id, describedBy, invalid } to spread onto the control.
import { computed } from 'vue'
const props = defineProps<{ id: string; label: string; hint?: string; error?: string; optional?: boolean; wide?: boolean }>()
const describedBy = computed(() => [props.hint && `${props.id}-hint`, props.error && `${props.id}-err`].filter(Boolean).join(' ') || undefined)
</script>

<template>
  <div class="field" :class="{ 'field--wide': wide, 'has-error': error }">
    <label :for="id" class="field__label">
      {{ label }} <span v-if="optional" class="field__opt">optional</span>
    </label>
    <slot :id="id" :described-by="describedBy" :invalid="!!error" />
    <p v-if="hint" :id="`${id}-hint`" class="field__hint">{{ hint }}</p>
    <p v-if="error" :id="`${id}-err`" class="field__error">{{ error }}</p>
  </div>
</template>

<style scoped>
.field { display: flex; flex-direction: column; gap: 0.15rem; min-width: 0; }
.field__label { font-weight: 600; font-size: 0.9rem; }
.field__opt { font-family: var(--font-mono); font-weight: 400; font-size: 0.62rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink-faint); margin-left: 0.4rem; }
.field__hint { font-size: 0.78rem; color: var(--ink-faint); margin: 0.35rem 0 0; }
.field__error { font-size: 0.82rem; color: #a33b25; margin: 0.35rem 0 0; font-weight: 500; }
@media (min-width: 700px) { .field--wide { grid-column: 1 / -1; } }
</style>
