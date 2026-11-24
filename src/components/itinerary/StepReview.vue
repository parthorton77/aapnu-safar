<script setup lang="ts">
import { computed } from 'vue'
import { useEnquiryDraft } from '../../composables/useEnquiryDraft'
import type { Errors } from './validation'

defineProps<{ errors: Errors }>()
const emit = defineEmits<{ edit: [step: number] }>()
const { draft } = useEnquiryDraft()

const fmt = (iso: string) => iso ? new Date(iso + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' }) : '—'
const contactLabel = { whatsapp: 'WhatsApp', email: 'Email', phone: 'Phone call' } as const
const kindLabel = { pickup: 'Pickup', destination: 'Destination', sightseeing: 'Sightseeing', overnight: 'Overnight', drop: 'Drop-off' } as const
const typeLabel = { local: 'Local', intercity: 'Intercity', standby: 'Standby' } as const
const days = computed(() => draft.days.filter(d => d.stops.some(s => s.place.trim()) || d.overnightAt || d.notes))
</script>

<template>
  <div class="review">
    <p class="intro">Please check everything below. When you send it, our team reviews the journey and replies with a personalised quotation. <strong>This is not a booking</strong>, and no payment is taken.</p>

    <section class="block">
      <header><h3>Dates &amp; pickup</h3><button type="button" class="btn-quiet" @click="emit('edit', 2)">Edit</button></header>
      <dl>
        <dt>Travel</dt><dd>{{ fmt(draft.trip.startDate) }} → {{ fmt(draft.trip.endDate) }}</dd>
        <dt>Pickup</dt><dd>{{ draft.trip.pickupLocation }}<template v-if="draft.trip.arrivalTime"> · around {{ draft.trip.arrivalTime }}</template><template v-if="draft.trip.pickupAddress"><br /><span class="soft">{{ draft.trip.pickupAddress }}</span></template></dd>
        <dt>Drop-off</dt><dd>{{ draft.trip.dropLocation }}</dd>
      </dl>
    </section>

    <section class="block">
      <header><h3>Travellers</h3><button type="button" class="btn-quiet" @click="emit('edit', 1)">Edit</button></header>
      <dl>
        <dt>Passengers</dt><dd>{{ draft.passengers.adults }} adult{{ draft.passengers.adults > 1 ? 's' : '' }}<template v-if="draft.passengers.children">, {{ draft.passengers.children }} child{{ draft.passengers.children > 1 ? 'ren' : '' }}</template></dd>
        <dt>Main passenger</dt><dd>{{ draft.passengers.primaryName }} · {{ draft.passengers.indianPhone }}</dd>
        <template v-if="draft.passengers.luggage"><dt>Luggage</dt><dd>{{ draft.passengers.luggage }}</dd></template>
        <template v-if="draft.passengers.assistance"><dt>Requirements</dt><dd>{{ draft.passengers.assistance }}</dd></template>
      </dl>
    </section>

    <section class="block">
      <header><h3>Daily itinerary</h3><button type="button" class="btn-quiet" @click="emit('edit', 3)">Edit</button></header>
      <ol v-if="days.length" class="days">
        <li v-for="(d, i) in days" :key="d.id">
          <p class="days__h"><span class="days__n">Day {{ i + 1 }}</span> <span class="meta">{{ d.date ? fmt(d.date) : '' }} · {{ typeLabel[d.type] }}</span></p>
          <ul class="days__stops">
            <li v-for="s in d.stops.filter(s => s.place.trim())" :key="s.id"><span class="meta">{{ kindLabel[s.kind] }}</span> {{ s.place }}<template v-if="s.time"> · {{ s.time }}</template><template v-if="s.note"> — <span class="soft">{{ s.note }}</span></template></li>
            <li v-if="d.overnightAt"><span class="meta">Overnight</span> {{ d.overnightAt }}</li>
          </ul>
          <p v-if="d.notes" class="soft small">{{ d.notes }}</p>
        </li>
      </ol>
      <p v-else class="soft">No days filled in.</p>
      <p v-if="draft.attachment" class="small">Attached itinerary: <strong>{{ draft.attachment.name }}</strong></p>
    </section>

    <section class="block">
      <header><h3>Your contact details</h3><button type="button" class="btn-quiet" @click="emit('edit', 0)">Edit</button></header>
      <dl>
        <dt>Name</dt><dd>{{ draft.customer.name }}</dd>
        <dt>Email</dt><dd>{{ draft.customer.email }}</dd>
        <dt>WhatsApp / phone</dt><dd>{{ draft.customer.phone }}</dd>
        <dt>Lives in</dt><dd>{{ draft.customer.countryOfResidence }}</dd>
        <dt>Prefers</dt><dd>{{ contactLabel[draft.customer.preferredContact] }}</dd>
      </dl>
    </section>

    <div class="block block--plain">
      <label class="lbl" for="r-notes">Anything else we should know? <span class="meta">optional</span></label>
      <textarea id="r-notes" v-model="draft.additionalNotes" class="textarea" rows="3" />
    </div>

    <div class="consent" :class="{ 'has-error': errors.consent }">
      <label class="consent__lbl">
        <input v-model="draft.consent" type="checkbox" :aria-invalid="!!errors.consent" :aria-describedby="errors.consent ? 'consent-err' : undefined" />
        <span>I understand this is an <strong>itinerary enquiry</strong>, not a booking. Aapnu Safar will review it and send a quotation, and nothing is confirmed until I accept the quotation and payment is agreed. I agree to be contacted about this enquiry.</span>
      </label>
      <p v-if="errors.consent" id="consent-err" class="err" role="alert">{{ errors.consent }}</p>
    </div>
  </div>
</template>

<style scoped>
.review { display: grid; gap: 1.4rem; }
.intro { color: var(--ink-soft); max-width: 60ch; }
.block { border-top: 1px solid var(--rule-strong); padding-top: 1rem; }
.block header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem; }
.block h3 { font-size: 1.7rem; }
.block--plain { display: grid; gap: 0.3rem; }
dl { display: grid; grid-template-columns: minmax(7rem, 12rem) 1fr; gap: 0.45rem 1rem; margin: 0; font-size: 0.95rem; }
dt { color: var(--ink-faint); font-size: 0.85rem; }
dd { margin: 0; }
.soft { color: var(--ink-soft); }
.small { font-size: 0.85rem; }
.days { list-style: none; margin: 0; padding: 0; display: grid; gap: 1rem; }
.days__h { margin: 0 0 0.3rem; display: flex; align-items: baseline; gap: 0.7rem; flex-wrap: wrap; }
.days__n { font-family: var(--font-display); font-size: 1.3rem; }
.days__stops { margin: 0; padding-left: 1rem; border-left: 2px solid var(--terracotta); display: grid; gap: 0.25rem; list-style: none; font-size: 0.95rem; }
.days__stops .meta { display: inline-block; min-width: 7.5rem; }
.lbl { font-weight: 600; font-size: 0.9rem; }
.consent { border: 1px solid var(--rule-strong); padding: 1rem 1.1rem; background: rgb(198 164 91 / 0.1); }
.consent.has-error { border-color: #a33b25; }
.consent__lbl { display: flex; gap: 0.8rem; align-items: flex-start; cursor: pointer; font-size: 0.92rem; }
.consent__lbl input { width: 1.25rem; height: 1.25rem; margin-top: 0.15rem; accent-color: var(--forest); flex: none; }
.err { color: #a33b25; font-size: 0.85rem; font-weight: 500; margin: 0.5rem 0 0; }
@media (max-width: 600px) { dl { grid-template-columns: 1fr; } dt { margin-top: 0.4rem; } }
</style>
