<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import StepArranger from './StepArranger.vue'
import StepTravellers from './StepTravellers.vue'
import StepTrip from './StepTrip.vue'
import StepItinerary from './StepItinerary.vue'
import StepReview from './StepReview.vue'
import { stepTitles, validateStep, type Errors } from './validation'
import { useEnquiryDraft, newDay, newStop } from '../../composables/useEnquiryDraft'
import { enquiryService } from '../../services/enquiryService'
import { placeById } from '../../data/places'
import type { EnquiryReceipt, EnquirySubmission } from '../../types/enquiry'

const props = defineProps<{ addPlace?: string; compact?: boolean }>()
const { draft, step, savedAt, reset } = useEnquiryDraft()

const steps = [StepArranger, StepTravellers, StepTrip, StepItinerary, StepReview]
const errors = ref<Errors>({})
const reached = ref(step.value)
const sending = ref(false)
const sendError = ref('')
const receipt = ref<EnquiryReceipt | null>(null)
const notice = ref('')
const heading = ref<HTMLElement | null>(null)
const root = ref<HTMLElement | null>(null)

const savedLabel = computed(() => savedAt.value ? `Draft saved on this device · ${savedAt.value.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}` : 'Your answers are saved on this device as you type')

onMounted(() => {
  // "Add X to my journey" from the atlas
  const p = props.addPlace && placeById[props.addPlace]
  if (p) {
    const already = draft.days.some(d => d.stops.some(s => s.place === p.name))
    if (!already) {
      if (!draft.days.length) draft.days.push(newDay(draft.trip.startDate))
      draft.days[0].stops.push(newStop('sightseeing', p.name))
    }
    notice.value = `${p.name} has been added to your itinerary (step 4). Start with your details below.`
  }
})

async function go(to: number) {
  errors.value = {}
  step.value = to
  reached.value = Math.max(reached.value, to)
  await nextTick()
  heading.value?.focus({ preventScroll: true })
  root.value?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })
}

async function next() {
  errors.value = validateStep(step.value, draft)
  if (Object.keys(errors.value).length) {
    await nextTick()
    root.value?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
    return
  }
  if (step.value < steps.length - 1) go(step.value + 1)
  else submit()
}

function canJump(i: number) {
  return i <= reached.value && i !== step.value
}

async function submit() {
  sending.value = true
  sendError.value = ''
  const { attachment, ...rest } = draft
  const submission: EnquirySubmission = {
    ...JSON.parse(JSON.stringify(rest)),
    attachment: attachment ? { name: attachment.name, size: attachment.size, type: attachment.type } : null,
    submittedAt: new Date().toISOString(),
    source: 'website',
  }
  try {
    receipt.value = await enquiryService.submit(submission, attachment?.file)
    reset()
    reached.value = 0
    await nextTick()
    heading.value?.focus()
  } catch (e) {
    sendError.value = e instanceof Error ? e.message : 'Something went wrong while sending.'
  } finally {
    sending.value = false
  }
}

function startAgain() { receipt.value = null; reached.value = 0; go(0) }
</script>

<template>
  <div ref="root" class="builder" :class="{ 'builder--compact': compact }">
    <!-- Confirmation -->
    <div v-if="receipt" class="done" role="status">
      <p class="meta meta--accent">Enquiry received · Ref {{ receipt.reference }}</p>
      <h3 ref="heading" tabindex="-1" class="done__title">Thank you for sharing your journey.</h3>
      <p class="done__text">We’ll review your itinerary and get back to you with a personalised quotation.</p>
      <p class="done__small">Nothing has been booked, and no payment has been taken. Your booking is confirmed only after you accept the quotation and the agreed payment is made.</p>
      <div v-if="receipt.isMock" class="done__mock" role="note">
        <strong>Demo mode. This enquiry has not been sent to Aapnu Safar.</strong>
        The website isn’t connected to an enquiry system yet, so your details were kept only in this browser.
        Please contact Aapnu Safar directly to arrange your journey.
      </div>
      <button type="button" class="cta" @click="startAgain">Plan another journey <span class="cta__arrow" aria-hidden="true">→</span></button>
    </div>

    <template v-else>
      <!-- Step route -->
      <nav class="route" aria-label="Enquiry steps">
        <ol>
          <li v-for="(t, i) in stepTitles" :key="t" :class="{ 'is-current': i === step, 'is-done': i < reached || (i < step) }">
            <button type="button" :disabled="!canJump(i)" :aria-current="i === step ? 'step' : undefined" @click="go(i)">
              <span class="route__dot" aria-hidden="true" />
              <span class="route__no meta">{{ String.fromCharCode(65 + i) }}</span>
              <span class="route__t">{{ t }}</span>
            </button>
          </li>
        </ol>
      </nav>

      <p v-if="notice && step < 3" class="notice" role="status">{{ notice }}</p>

      <form class="sheet" novalidate @submit.prevent="next">
        <header class="sheet__head">
          <p class="meta">Step {{ String.fromCharCode(65 + step) }} of E</p>
          <h3 ref="heading" tabindex="-1" class="sheet__title">{{ stepTitles[step] }}</h3>
        </header>

        <p v-if="Object.keys(errors).length" class="sheet__errors" role="alert">
          Please check {{ Object.keys(errors).length === 1 ? 'the highlighted field' : `the ${Object.keys(errors).length} highlighted fields` }} before continuing.
        </p>

        <component :is="steps[step]" :errors="errors" @edit="go" />

        <footer class="sheet__foot">
          <button v-if="step > 0" type="button" class="cta" @click="go(step - 1)"><span class="cta__arrow" aria-hidden="true">←</span> Back</button>
          <span class="sheet__saved meta" aria-live="polite">{{ savedLabel }}</span>
          <button type="submit" class="cta cta--solid" :disabled="sending">
            <template v-if="step < steps.length - 1">Continue</template>
            <template v-else>{{ sending ? 'Sending…' : 'Send my itinerary enquiry' }}</template>
            <span class="cta__arrow" aria-hidden="true">→</span>
          </button>
        </footer>
        <p v-if="sendError" class="sheet__errors" role="alert">{{ sendError }} Your draft is still saved, so please try again.</p>
        <p v-if="step === steps.length - 1 && enquiryService.isMock" class="demo-note">
          Demo mode: the enquiry system isn’t connected yet, so sending will not reach Aapnu Safar.
        </p>
      </form>
    </template>
  </div>
</template>

<style scoped>
.builder { scroll-margin-top: 6rem; }
.route ol { list-style: none; margin: 0 0 1.6rem; padding: 0; display: flex; overflow-x: auto; scrollbar-width: none; border-top: 2px dashed var(--rule-strong); }
.route li { flex: 1 0 auto; position: relative; }
.route li.is-done::before, .route li.is-current::before { content: ''; position: absolute; left: 0; right: 0; top: -2px; height: 2px; background: var(--terracotta); }
.route li.is-current::before { right: 50%; }
.route button { display: flex; flex-direction: column; align-items: flex-start; gap: 0.2rem; background: none; border: 0; padding: 1rem 1rem 0.6rem 0; cursor: pointer; text-align: left; min-height: 2.75rem; position: relative; }
.route button:disabled { cursor: default; }
.route__dot { position: absolute; top: -8px; left: 0; width: 14px; height: 14px; border-radius: 50%; background: var(--paper); border: 2px solid var(--rule-strong); }
.is-done .route__dot { border-color: var(--terracotta); background: var(--terracotta); }
.is-current .route__dot { border-color: var(--terracotta); background: var(--paper); box-shadow: 0 0 0 4px rgb(183 101 69 / 0.2); }
.route__t { font-size: 0.82rem; font-weight: 600; color: var(--ink-faint); white-space: nowrap; }
.is-current .route__t, .is-done .route__t { color: var(--ink); }
.route button:not(:disabled):hover .route__t { color: var(--terracotta-ink); }

.notice { background: var(--forest); color: var(--paper); padding: 0.8rem 1rem; font-size: 0.9rem; }
.sheet { container: sheet / inline-size; background: var(--paper); border: 1px solid var(--rule-strong); padding: clamp(1.2rem, 3vw, 2.6rem); display: grid; gap: 1.6rem; position: relative; }
.sheet::after { content: ''; position: absolute; inset: 6px; border: 1px solid var(--rule); pointer-events: none; }
.sheet > * { position: relative; z-index: 1; }
.sheet__title { font-size: var(--step-3); margin-top: 0.4rem; }
.sheet__title:focus { outline: none; }
.sheet__errors { color: #a33b25; font-weight: 600; font-size: 0.9rem; margin: 0; }
.sheet__foot { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem 1.5rem; padding-top: 1.4rem; border-top: 1px solid var(--rule); }
.sheet__saved { order: 3; flex-basis: 100%; font-size: 0.6rem; }
.sheet__foot .cta--solid { margin-left: auto; }
.sheet__foot .cta--solid:disabled { opacity: 0.6; cursor: progress; }
.demo-note { font-size: 0.8rem; color: var(--terracotta-ink); margin: 0; }

.done { border: 1px solid var(--rule-strong); padding: clamp(1.5rem, 4vw, 3rem); display: grid; gap: 1rem; justify-items: start; background: var(--paper); }
.done__title { font-size: var(--step-3); }
.done__title:focus { outline: none; }
.done__text { font-size: var(--step-1); max-width: 40ch; margin: 0; }
.done__small { color: var(--ink-soft); font-size: 0.9rem; max-width: 56ch; }
.done__mock { border-left: 3px solid var(--terracotta); background: rgb(183 101 69 / 0.08); padding: 0.9rem 1rem; font-size: 0.9rem; max-width: 60ch; }
.done__mock strong { display: block; margin-bottom: 0.3rem; }
@media (min-width: 700px) { .sheet__saved { order: 0; flex-basis: auto; } }
</style>
