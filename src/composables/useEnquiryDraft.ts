// A single, module-level enquiry draft shared by the home page and the Plan page,
// saved to this browser while the visitor fills it in. (Plain reactive state; no store library needed.)
import { reactive, ref, watch } from 'vue'
import type { EnquiryDraft, ItineraryDay, ItineraryStop, StopKind } from '../types/enquiry'

const KEY = 'aapnu-safar:enquiry-draft:v1'

export const uid = () => (crypto.randomUUID?.() ?? Math.random().toString(36).slice(2))

export const newStop = (kind: StopKind = 'destination', place = ''): ItineraryStop => ({ id: uid(), kind, place, time: '', note: '' })
export const newDay = (date = ''): ItineraryDay => ({ id: uid(), date, type: 'local', stops: [newStop('pickup')], overnightAt: '', notes: '' })

const blank = (): EnquiryDraft => ({
  customer: { name: '', email: '', phone: '', countryOfResidence: '', preferredContact: 'whatsapp' },
  passengers: { primaryName: '', indianPhone: '', adults: 2, children: 0, luggage: '', assistance: '' },
  trip: { startDate: '', endDate: '', pickupLocation: '', pickupAddress: '', arrivalTime: '', dropLocation: '' },
  days: [],
  attachment: null,
  additionalNotes: '',
  consent: false,
})

function load(): EnquiryDraft {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...blank(), ...JSON.parse(raw), attachment: null }
  } catch { /* private mode or blocked storage */ }
  return blank()
}

const draft = reactive<EnquiryDraft>(load())
const step = ref(0)
const savedAt = ref<Date | null>(null)
let timer = 0

watch(draft, () => {
  clearTimeout(timer)
  timer = window.setTimeout(() => {
    try {
      // The uploaded File itself is never stored — only the draft text.
      localStorage.setItem(KEY, JSON.stringify({ ...draft, attachment: null }))
      savedAt.value = new Date()
    } catch { /* ignore */ }
  }, 400)
}, { deep: true })

function reset() {
  Object.assign(draft, blank())
  step.value = 0
  try { localStorage.removeItem(KEY) } catch { /* ignore */ }
  savedAt.value = null
}

/** YYYY-MM-DD in local time (toISOString would shift the date for timezones ahead of UTC, such as IST). */
export const localISO = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

/** Days between start and end (inclusive), capped for sanity. */
export function datesBetween(start: string, end: string, cap = 30): string[] {
  if (!start || !end) return []
  const out: string[] = []
  const d = new Date(start + 'T00:00:00')
  const e = new Date(end + 'T00:00:00')
  while (d <= e && out.length < cap) {
    out.push(localISO(d))
    d.setDate(d.getDate() + 1)
  }
  return out
}

export function useEnquiryDraft() {
  return { draft, step, savedAt, reset }
}
