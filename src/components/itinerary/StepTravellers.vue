<script setup lang="ts">
import { computed } from 'vue'
import FormField from '../forms/FormField.vue'
import { useEnquiryDraft } from '../../composables/useEnquiryDraft'
import type { Errors } from './validation'

defineProps<{ errors: Errors }>()
const { draft } = useEnquiryDraft()
const total = computed(() => draft.passengers.adults + draft.passengers.children)
const bump = (k: 'adults' | 'children', n: number) => {
  const min = k === 'adults' ? 1 : 0
  draft.passengers[k] = Math.max(min, Math.min(20, draft.passengers[k] + n))
}
</script>

<template>
  <div class="grid">
    <p class="intro">Now the people who will actually travel in Gujarat. We’ll coordinate pickups with them directly.</p>
    <FormField id="p-name" label="Main passenger’s name" :error="errors['passengers.primaryName']" v-slot="f">
      <input :id="f.id" v-model="draft.passengers.primaryName" class="input" :aria-invalid="f.invalid" :aria-describedby="f.describedBy" />
    </FormField>
    <FormField id="p-phone" label="Their Indian contact number" hint="10-digit mobile number in India" :error="errors['passengers.indianPhone']" v-slot="f">
      <input :id="f.id" v-model="draft.passengers.indianPhone" type="tel" inputmode="tel" class="input" placeholder="+91" :aria-invalid="f.invalid" :aria-describedby="f.describedBy" />
    </FormField>

    <div class="counters field--wide">
      <div v-for="k in (['adults', 'children'] as const)" :key="k" class="counter">
        <span :id="`cnt-${k}`" class="counter__label">{{ k === 'adults' ? 'Adults' : 'Children' }}</span>
        <div class="counter__ctl" role="group" :aria-labelledby="`cnt-${k}`">
          <button type="button" class="btn-icon" :aria-label="`Fewer ${k}`" :disabled="draft.passengers[k] <= (k === 'adults' ? 1 : 0)" @click="bump(k, -1)">−</button>
          <output class="counter__val" aria-live="polite">{{ draft.passengers[k] }}</output>
          <button type="button" class="btn-icon" :aria-label="`More ${k}`" @click="bump(k, 1)">+</button>
        </div>
      </div>
      <p class="counter__note meta">{{ total }} travelling<template v-if="total > 6"> · larger groups are reviewed individually; we’ll advise on the right arrangement</template></p>
    </div>

    <FormField id="p-luggage" label="Luggage" hint="For example: 4 large suitcases, 2 cabin bags, one wheelchair. Space depends on seating, so this helps us plan honestly." optional wide v-slot="f">
      <textarea :id="f.id" v-model="draft.passengers.luggage" class="textarea" rows="2" :aria-describedby="f.describedBy" />
    </FormField>
    <FormField id="p-assist" label="Special assistance or family requirements" hint="Elderly parents, mobility needs, child seats, frequent rest stops, dietary stops, anything that helps us care for them." optional wide v-slot="f">
      <textarea :id="f.id" v-model="draft.passengers.assistance" class="textarea" rows="3" :aria-describedby="f.describedBy" />
    </FormField>
  </div>
</template>

<style scoped>
.grid { display: grid; gap: 1.6rem var(--gutter); }
.intro { color: var(--ink-soft); max-width: 52ch; margin: 0; }
.counters { display: flex; flex-wrap: wrap; align-items: center; gap: 1rem 2.5rem; padding: 0.8rem 0; border-block: 1px solid var(--rule); }
.counter { display: flex; align-items: center; gap: 1rem; }
.counter__label { font-weight: 600; font-size: 0.9rem; min-width: 4.5rem; }
.counter__ctl { display: flex; align-items: center; border: 1px solid var(--rule-strong); border-radius: 2px; }
.counter__ctl .btn-icon { font-size: 1.3rem; }
.counter__val { min-width: 2.5rem; text-align: center; font-family: var(--font-display); font-size: 1.7rem; }
.counter__note { flex-basis: 100%; }
@media (min-width: 700px) { .grid { grid-template-columns: 1fr 1fr; } .intro { grid-column: 1 / -1; } .counter__note { flex-basis: auto; } }
</style>
