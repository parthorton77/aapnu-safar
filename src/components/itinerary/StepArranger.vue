<script setup lang="ts">
import FormField from '../forms/FormField.vue'
import { useEnquiryDraft } from '../../composables/useEnquiryDraft'
import type { Errors } from './validation'

defineProps<{ errors: Errors }>()
const { draft } = useEnquiryDraft()
const countries = ['United States', 'Canada', 'United Kingdom', 'Australia', 'United Arab Emirates', 'New Zealand', 'Singapore', 'Kenya', 'Tanzania', 'Uganda', 'Germany', 'Netherlands', 'Oman', 'Qatar', 'Saudi Arabia', 'India']
const methods = [{ v: 'whatsapp', l: 'WhatsApp' }, { v: 'email', l: 'Email' }, { v: 'phone', l: 'Phone call' }] as const
</script>

<template>
  <div class="grid">
    <p class="intro">You may be arranging this from abroad for parents or relatives. Start with <em>your</em> details, so we know who to send the quotation to.</p>
    <FormField id="c-name" label="Your full name" :error="errors['customer.name']" v-slot="f">
      <input :id="f.id" v-model="draft.customer.name" class="input" autocomplete="name" :aria-invalid="f.invalid" :aria-describedby="f.describedBy" />
    </FormField>
    <FormField id="c-email" label="Email address" :error="errors['customer.email']" v-slot="f">
      <input :id="f.id" v-model="draft.customer.email" type="email" class="input" autocomplete="email" inputmode="email" :aria-invalid="f.invalid" :aria-describedby="f.describedBy" />
    </FormField>
    <FormField id="c-phone" label="WhatsApp / phone number" hint="Include your country code, e.g. +1 416 555 0134" :error="errors['customer.phone']" v-slot="f">
      <input :id="f.id" v-model="draft.customer.phone" type="tel" class="input" autocomplete="tel" inputmode="tel" :aria-invalid="f.invalid" :aria-describedby="f.describedBy" />
    </FormField>
    <FormField id="c-country" label="Country you live in" :error="errors['customer.countryOfResidence']" v-slot="f">
      <input :id="f.id" v-model="draft.customer.countryOfResidence" class="input" list="country-list" autocomplete="country-name" :aria-invalid="f.invalid" :aria-describedby="f.describedBy" />
      <datalist id="country-list"><option v-for="c in countries" :key="c" :value="c" /></datalist>
    </FormField>
    <fieldset class="field--wide fs">
      <legend class="legend">How should we contact you?</legend>
      <div class="choice">
        <label v-for="m in methods" :key="m.v"><input v-model="draft.customer.preferredContact" type="radio" name="contact" :value="m.v" />{{ m.l }}</label>
      </div>
    </fieldset>
  </div>
</template>

<style scoped>
.grid { display: grid; gap: 1.6rem var(--gutter); }
.intro { color: var(--ink-soft); max-width: 52ch; margin: 0; }
.fs { border: 0; padding: 0; margin: 0; }
.legend { font-weight: 600; font-size: 0.9rem; margin-bottom: 0.7rem; padding: 0; }
@media (min-width: 700px) { .grid { grid-template-columns: 1fr 1fr; } .intro, .fs { grid-column: 1 / -1; } }
</style>
