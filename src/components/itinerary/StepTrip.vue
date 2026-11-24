<script setup lang="ts">
import FormField from '../forms/FormField.vue'
import { useEnquiryDraft, localISO } from '../../composables/useEnquiryDraft'
import { pickupSuggestions } from '../../data/locations'
import type { Errors } from './validation'

defineProps<{ errors: Errors }>()
const { draft } = useEnquiryDraft()
const today = localISO(new Date())
</script>

<template>
  <div class="grid">
    <p class="intro">The outline of the trip. Approximate is fine: we’ll confirm everything with you before quoting.</p>
    <FormField id="t-start" label="Start date" :error="errors['trip.startDate']" v-slot="f">
      <input :id="f.id" v-model="draft.trip.startDate" type="date" :min="today" class="input" :aria-invalid="f.invalid" :aria-describedby="f.describedBy" />
    </FormField>
    <FormField id="t-end" label="End date" :error="errors['trip.endDate']" v-slot="f">
      <input :id="f.id" v-model="draft.trip.endDate" type="date" :min="draft.trip.startDate || today" class="input" :aria-invalid="f.invalid" :aria-describedby="f.describedBy" />
    </FormField>
    <FormField id="t-pickup" label="Pickup location" hint="Choose a suggestion or type any place" :error="errors['trip.pickupLocation']" v-slot="f">
      <input :id="f.id" v-model="draft.trip.pickupLocation" class="input" list="pickup-list" :aria-invalid="f.invalid" :aria-describedby="f.describedBy" />
    </FormField>
    <FormField id="t-arrival" label="Approximate arrival / pickup time" optional v-slot="f">
      <input :id="f.id" v-model="draft.trip.arrivalTime" type="time" class="input" :aria-describedby="f.describedBy" />
    </FormField>
    <FormField id="t-address" label="Airport terminal, flight number or address" hint="For airport pickups, a flight number helps us track delays." optional wide v-slot="f">
      <input :id="f.id" v-model="draft.trip.pickupAddress" class="input" :aria-describedby="f.describedBy" />
    </FormField>
    <FormField id="t-drop" label="Expected drop-off location" :error="errors['trip.dropLocation']" wide v-slot="f">
      <input :id="f.id" v-model="draft.trip.dropLocation" class="input" list="pickup-list" :aria-invalid="f.invalid" :aria-describedby="f.describedBy" />
    </FormField>
    <datalist id="pickup-list"><option v-for="p in pickupSuggestions" :key="p" :value="p" /></datalist>
  </div>
</template>

<style scoped>
.grid { display: grid; gap: 1.6rem var(--gutter); }
.intro { color: var(--ink-soft); max-width: 52ch; margin: 0; }
@media (min-width: 700px) { .grid { grid-template-columns: 1fr 1fr; } .intro { grid-column: 1 / -1; } }
</style>
