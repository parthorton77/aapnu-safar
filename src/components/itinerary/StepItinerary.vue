<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Plus, Upload, FileText, X } from 'lucide-vue-next'
import DayCard from './DayCard.vue'
import GujaratAtlas from '../map/GujaratAtlas.vue'
import { useEnquiryDraft, newDay, datesBetween } from '../../composables/useEnquiryDraft'
import { stopSuggestions } from '../../data/locations'
import { places } from '../../data/places'
import type { Errors } from './validation'

defineProps<{ errors: Errors }>()
const { draft } = useEnquiryDraft()
const fileError = ref('')
const fileInput = ref<HTMLInputElement | null>(null)

const dates = computed(() => datesBetween(draft.trip.startDate, draft.trip.endDate))

function buildFromDates() {
  draft.days = dates.value.map((d, i) => {
    const day = newDay(d)
    if (i === 0 && draft.trip.pickupLocation) day.stops[0].place = draft.trip.pickupLocation
    return day
  })
}
// Days created before dates were chosen (e.g. "Add to my journey" from the atlas) get dated now.
onMounted(() => draft.days.forEach((d, i) => { if (!d.date && dates.value[i]) d.date = dates.value[i] }))
function addRemaining() {
  for (const d of dates.value.slice(draft.days.length)) draft.days.push(newDay(d))
}

function addDay() {
  const last = draft.days.at(-1)?.date
  // the day after the last one, if it has a date
  const date = last ? datesBetween(last, '9999-12-31', 2)[1] ?? '' : ''
  draft.days.push(newDay(date))
}

// Places on the corridor mentioned anywhere in the plan, shown on the mini atlas.
const mentioned = computed(() => {
  const text = draft.days.flatMap(d => [...d.stops.map(s => s.place), d.overnightAt]).join(' ').toLowerCase()
  return places.filter(p => text.includes(p.name.toLowerCase()) || (p.id === 'ekta-nagar' && text.includes('statue of unity'))).map(p => p.id)
})

const ACCEPT = '.pdf,.xls,.xlsx,.csv,application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv'
function onFile(e: Event) {
  fileError.value = ''
  const f = (e.target as HTMLInputElement).files?.[0]
  if (!f) return
  if (!/\.(pdf|xlsx?|csv)$/i.test(f.name)) { fileError.value = 'Please upload a PDF or Excel file.'; return }
  if (f.size > 10 * 1024 * 1024) { fileError.value = 'That file is larger than 10 MB. Please send a smaller version.'; return }
  draft.attachment = { name: f.name, size: f.size, type: f.type, file: f }
}
function clearFile() { draft.attachment = null; if (fileInput.value) fileInput.value.value = '' }
</script>

<template>
  <div class="itin">
    <div class="itin__main">
      <p class="intro">Sketch each day as best you can: where the family starts, the places they’d like to go and where they’ll sleep. Approximate times are perfect.</p>

      <div v-if="!draft.days.length" class="itin__empty">
        <p v-if="dates.length">Your trip runs for <strong>{{ dates.length }} day{{ dates.length > 1 ? 's' : '' }}</strong>.</p>
        <div class="itin__empty-actions">
          <button v-if="dates.length" type="button" class="cta cta--solid" @click="buildFromDates">Lay out {{ dates.length }} day{{ dates.length > 1 ? 's' : '' }} <span class="cta__arrow" aria-hidden="true">→</span></button>
          <button type="button" class="btn-quiet" @click="addDay"><Plus :size="14" aria-hidden="true" /> Add a single day</button>
        </div>
      </div>

      <div class="itin__days">
        <DayCard v-for="(d, i) in draft.days" :key="d.id" :day="d" :index="i" :total="draft.days.length" :errors="errors" @remove="draft.days.splice(i, 1)" />
      </div>
      <div v-if="draft.days.length" class="itin__more">
        <button v-if="draft.days.length < dates.length" type="button" class="btn-quiet" @click="addRemaining"><Plus :size="14" aria-hidden="true" /> Add the remaining {{ dates.length - draft.days.length }} day{{ dates.length - draft.days.length > 1 ? 's' : '' }} of your trip</button>
        <button type="button" class="btn-quiet" @click="addDay"><Plus :size="14" aria-hidden="true" /> Add another day</button>
      </div>
      <p v-if="errors.days" class="err" role="alert">{{ errors.days }}</p>

      <div class="upload">
        <p class="upload__title">Already have an itinerary?</p>
        <p class="upload__hint">Upload a PDF or Excel file (up to 10 MB) instead of, or as well as, filling in the days.</p>
        <div v-if="draft.attachment" class="upload__file">
          <FileText :size="18" aria-hidden="true" />
          <span>{{ draft.attachment.name }} <span class="meta">{{ Math.ceil(draft.attachment.size / 1024) }} KB</span></span>
          <button type="button" class="btn-icon" aria-label="Remove uploaded file" @click="clearFile"><X :size="16" /></button>
        </div>
        <label v-else class="btn-quiet upload__btn">
          <Upload :size="14" aria-hidden="true" /> Choose a file
          <input ref="fileInput" type="file" :accept="ACCEPT" class="visually-hidden" @change="onFile" />
        </label>
        <p v-if="fileError" class="err" role="alert">{{ fileError }}</p>
        <p class="upload__hint">Files aren’t kept in the saved draft. If you reload the page, please attach the file again.</p>
      </div>
    </div>

    <aside class="itin__map" aria-label="Places from your plan on the corridor map">
      <div class="itin__sticky">
        <span class="meta">Your plan, on the map</span>
        <GujaratAtlas :progress="1" :zoom="1" :interactive="false" :highlight="mentioned" :show-distances="false" title="Map highlighting the corridor places mentioned in your itinerary" />
        <p class="meta">{{ mentioned.length ? `${mentioned.length} corridor place${mentioned.length > 1 ? 's' : ''} in your plan` : 'Corridor places you add appear in gold' }}</p>
      </div>
    </aside>
    <datalist id="stop-list"><option v-for="p in stopSuggestions" :key="p" :value="p" /></datalist>
  </div>
</template>

<style scoped>
.itin { display: grid; gap: 2rem; }
.itin__more { display: flex; flex-wrap: wrap; gap: 0.6rem; }
.intro { color: var(--ink-soft); max-width: 52ch; }
.itin__main { display: grid; gap: 1.2rem; align-content: start; min-width: 0; }
.itin__empty { border: 1px dashed var(--rule-strong); padding: 1.5rem; }
.itin__empty-actions { display: flex; flex-wrap: wrap; gap: 1rem; align-items: center; }
.itin__days { display: grid; gap: 1.2rem; }
.err { color: #a33b25; font-size: 0.85rem; font-weight: 500; margin: 0; }
.upload { margin-top: 1rem; padding-top: 1.4rem; border-top: 1px solid var(--rule-strong); display: grid; gap: 0.5rem; justify-items: start; }
.upload__title { font-family: var(--font-display); font-size: 1.6rem; margin: 0; }
.upload__hint { font-size: 0.8rem; color: var(--ink-faint); margin: 0; }
.upload__btn { cursor: pointer; }
.upload__btn:focus-within { box-shadow: var(--focus); }
.upload__file { display: flex; align-items: center; gap: 0.7rem; padding: 0.4rem 0.4rem 0.4rem 0.9rem; border: 1px solid var(--rule-strong); }
.itin__map .meta { display: block; margin: 0.4rem 0; }
.itin__sticky { position: sticky; top: 6rem; border: 1px solid var(--rule); padding: 0.6rem; }
/* responds to the form width, not the window */
.itin__map { order: -1; }
.itin__sticky { position: static; max-width: 420px; }
@container sheet (min-width: 860px) {
  .itin { grid-template-columns: minmax(0, 1fr) 260px; }
  .itin__map { order: 0; }
  .itin__sticky { position: sticky; max-width: none; }
}
</style>
