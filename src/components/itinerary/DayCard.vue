<script setup lang="ts">
import { computed } from 'vue'
import { ArrowUp, ArrowDown, X, Plus } from 'lucide-vue-next'
import type { ItineraryDay, StopKind } from '../../types/enquiry'
import { newStop } from '../../composables/useEnquiryDraft'
import type { Errors } from './validation'

const props = defineProps<{ day: ItineraryDay; index: number; total: number; errors: Errors }>()
const emit = defineEmits<{ remove: [] }>()

const kinds: { v: StopKind; l: string }[] = [
  { v: 'pickup', l: 'Pickup' }, { v: 'destination', l: 'Destination' }, { v: 'sightseeing', l: 'Sightseeing' },
  { v: 'overnight', l: 'Overnight stay' }, { v: 'drop', l: 'Drop-off' },
]
const types = [{ v: 'local', l: 'Local travel' }, { v: 'intercity', l: 'Intercity' }, { v: 'standby', l: 'Standby / rest day' }] as const

const dateLabel = computed(() => {
  if (!props.day.date) return ''
  return new Date(props.day.date + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
})

function move(i: number, dir: -1 | 1) {
  const s = props.day.stops
  const j = i + dir
  if (j < 0 || j >= s.length) return
  ;[s[i], s[j]] = [s[j], s[i]]
  // keep focus on the moved stop's same button for keyboard users
  requestAnimationFrame(() => document.getElementById(`mv-${s[j].id}-${dir}`)?.focus())
}
function addStop() {
  const s = newStop(props.day.stops.length ? 'destination' : 'pickup')
  props.day.stops.push(s)
  requestAnimationFrame(() => document.getElementById(`place-${s.id}`)?.focus())
}
</script>

<template>
  <article class="day" :aria-labelledby="`day-h-${day.id}`">
    <header class="day__head">
      <h3 :id="`day-h-${day.id}`" class="day__title">Day {{ index + 1 }} <span v-if="dateLabel" class="meta">{{ dateLabel }}</span></h3>
      <button type="button" class="btn-quiet" :aria-label="`Remove day ${index + 1}`" @click="emit('remove')"><X :size="14" aria-hidden="true" /> Remove day</button>
    </header>

    <div class="choice day__type" role="radiogroup" :aria-label="`Type of travel on day ${index + 1}`">
      <label v-for="t in types" :key="t.v"><input v-model="day.type" type="radio" :name="`type-${day.id}`" :value="t.v" />{{ t.l }}</label>
    </div>

    <ol class="stops" :aria-label="`Stops on day ${index + 1}`">
      <li v-for="(s, i) in day.stops" :key="s.id" class="stop">
        <span class="stop__pin" aria-hidden="true">{{ i + 1 }}</span>
        <div class="stop__fields">
          <select v-model="s.kind" class="select stop__kind" :aria-label="`Stop ${i + 1} type`">
            <option v-for="k in kinds" :key="k.v" :value="k.v">{{ k.l }}</option>
          </select>
          <input :id="`place-${s.id}`" v-model="s.place" class="input stop__place" list="stop-list" placeholder="Place, e.g. Statue of Unity"
            :aria-label="`Stop ${i + 1} place`" :aria-invalid="!!errors[`days.${index}.stops.${i}`]"
            :aria-describedby="errors[`days.${index}.stops.${i}`] ? `err-${s.id}` : undefined" />
          <input v-model="s.time" class="input stop__time" placeholder="Approx. time" :aria-label="`Stop ${i + 1} approximate time`" />
          <input v-model="s.note" class="input stop__note" placeholder="Note (optional)" :aria-label="`Stop ${i + 1} note`" />
          <p v-if="errors[`days.${index}.stops.${i}`]" :id="`err-${s.id}`" class="stop__err" role="alert">{{ errors[`days.${index}.stops.${i}`] }}</p>
        </div>
        <div class="stop__ctl">
          <button :id="`mv-${s.id}--1`" type="button" class="btn-icon" :disabled="i === 0" :aria-label="`Move stop ${i + 1} earlier`" @click="move(i, -1)"><ArrowUp :size="16" /></button>
          <button :id="`mv-${s.id}-1`" type="button" class="btn-icon" :disabled="i === day.stops.length - 1" :aria-label="`Move stop ${i + 1} later`" @click="move(i, 1)"><ArrowDown :size="16" /></button>
          <button type="button" class="btn-icon" :aria-label="`Remove stop ${i + 1}`" @click="day.stops.splice(i, 1)"><X :size="16" /></button>
        </div>
      </li>
    </ol>
    <button type="button" class="btn-quiet" @click="addStop"><Plus :size="14" aria-hidden="true" /> Add a stop</button>

    <div class="day__foot">
      <label class="day__lbl" :for="`ov-${day.id}`">Overnight at</label>
      <input :id="`ov-${day.id}`" v-model="day.overnightAt" class="input" list="stop-list" placeholder="Where will the family stay tonight?" />
      <label class="day__lbl" :for="`dn-${day.id}`">Notes for this day</label>
      <textarea :id="`dn-${day.id}`" v-model="day.notes" class="textarea" rows="2" placeholder="Rest stops, timings, people to visit…" />
    </div>
  </article>
</template>

<style scoped>
.day { border: 1px solid var(--rule-strong); background: var(--paper); padding: 1.2rem; display: grid; gap: 1.1rem; position: relative; }
.day::before { content: ''; position: absolute; left: -1px; top: -1px; bottom: -1px; width: 4px; background: var(--terracotta); }
.day__head { display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap; }
.day__title { font-size: 1.8rem; display: flex; align-items: baseline; gap: 0.8rem; }
.day__type label { min-height: 2.4rem; padding: 0.35rem 0.75rem; font-size: 0.85rem; }
.stops { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.4rem; }
.stop { display: grid; grid-template-columns: 1.8rem 1fr; gap: 0.6rem; padding: 0.6rem 0; border-bottom: 1px dashed var(--rule); }
.stop__pin { width: 1.6rem; height: 1.6rem; border-radius: 50%; border: 1.5px solid var(--ink); display: grid; place-items: center; font-family: var(--font-mono); font-size: 0.7rem; margin-top: 0.8rem; }
.stop__fields { display: grid; gap: 0 0.8rem; grid-template-columns: 1fr 1fr; }
.stop__kind { grid-column: 1 / -1; font-size: 0.9rem; min-height: 2.5rem; }
.stop__place { grid-column: 1 / -1; }
.stop__err { grid-column: 1 / -1; color: #a33b25; font-size: 0.8rem; margin: 0.3rem 0 0; }
.stop__ctl { grid-column: 2; display: flex; gap: 0.2rem; }
.day__foot { display: grid; gap: 0.3rem; }
.day__lbl { font-weight: 600; font-size: 0.85rem; margin-top: 0.6rem; }

@container sheet (min-width: 720px) {
  .stop { grid-template-columns: 1.8rem 1fr auto; align-items: start; }
  .stop__fields { grid-template-columns: 8.5rem minmax(12rem, 1fr) 7rem; }
  .stop__kind { grid-column: auto; }
  .stop__place { grid-column: auto; }
  .stop__note { grid-column: 2 / 4; }
  .stop__ctl { grid-column: 3; margin-top: 0.2rem; }
}
</style>
