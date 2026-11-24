<script setup lang="ts">
// The Aapnu Safar atlas: an illustrated Gujarat road plate.
// `progress` (0–1) draws the route; `zoom` (0–1) moves from the whole state to the corridor.
import { computed, ref, useId } from 'vue'
import { GUJARAT, ENCLAVES, NEIGHBOURS } from './geometry'
import { VIEW } from './projection'
import {
  markers, corridorPath, spurPath, shields, legLabels, rivers, seaLabels, graticule, SCALE_50KM, CORRIDOR_BOX,
} from './routes'

const props = withDefaults(defineProps<{
  progress?: number
  zoom?: number
  active?: string | null
  interactive?: boolean
  /** ids to emphasise (e.g. stops in the visitor's itinerary) */
  highlight?: string[]
  showDistances?: boolean
  title?: string
}>(), { progress: 1, zoom: 0, active: null, interactive: true, highlight: () => [], showDistances: true, title: 'Map of Gujarat showing the Aapnu Safar service corridor' })

const uid = useId()
const emit = defineEmits<{ 'update:active': [id: string | null] }>()

// Route order, Ahmedabad → Surat, as fraction of the corridor (by approximate road km).
const T: Record<string, number> = { ahmedabad: 0, nadiad: 0.21, anand: 0.28, vadodara: 0.43, bharuch: 0.72, ankleshwar: 0.75, surat: 1 }
const ORDER = ['ahmedabad', 'nadiad', 'anand', 'vadodara', 'ekta-nagar', 'bharuch', 'ankleshwar', 'surat']

const corridorProgress = computed(() => Math.min(1, props.progress / 0.9))
const spurProgress = computed(() => Math.max(0, Math.min(1, (corridorProgress.value - T.vadodara) / 0.3)))

function visible(id: string) {
  if (id === 'ekta-nagar') return spurProgress.value > 0.92
  return corridorProgress.value >= (T[id] ?? 0) - 0.005
}

// Interpolated viewBox; corridor box is padded to the plate's aspect ratio.
const vb = computed(() => {
  const z = easeInOut(Math.max(0, Math.min(1, props.zoom)))
  const aspect = VIEW.width / VIEW.height
  const h = CORRIDOR_BOX.h
  const w = h * aspect
  const cx = CORRIDOR_BOX.x + CORRIDOR_BOX.w / 2
  const tx = cx - w / 2
  const ty = CORRIDOR_BOX.y
  return {
    x: lerp(0, tx, z), y: lerp(0, ty, z), w: lerp(VIEW.width, w, z), h: lerp(VIEW.height, h, z),
  }
})
const k = computed(() => vb.value.w / VIEW.width) // user units per "full-view unit"
// markers grow a little as the map zooms in, so labels stay legible on the corridor plate
const mk = computed(() => k.value * (1 + 0.35 * Math.max(0, Math.min(1, props.zoom))))
const viewBox = computed(() => `${vb.value.x} ${vb.value.y} ${vb.value.w} ${vb.value.h}`)

function lerp(a: number, b: number, t: number) { return a + (b - a) * t }
function easeInOut(t: number) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2 }

const hovered = ref<string | null>(null)
const current = computed(() => hovered.value ?? props.active)

function select(id: string) { if (props.interactive) emit('update:active', props.active === id ? null : id) }
function onKey(e: KeyboardEvent, id: string) {
  if (!props.interactive) return
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); emit('update:active', id); return }
  const dir = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0
  if (!dir) return
  e.preventDefault()
  const next = ORDER[(ORDER.indexOf(id) + dir + ORDER.length) % ORDER.length]
  const el = (e.currentTarget as SVGElement).ownerSVGElement?.querySelector<SVGGElement>(`[data-place="${next}"]`)
  el?.focus()
  emit('update:active', next)
}

const scaleBar = computed(() => ({ x: vb.value.x + 34 * k.value, y: vb.value.y + vb.value.h - 46 * k.value }))
const compass = computed(() => ({ x: vb.value.x + vb.value.w - 64 * k.value, y: vb.value.y + 78 * k.value }))
</script>

<template>
  <svg
    class="atlas"
    :class="{ 'is-interactive': interactive }"
    :viewBox="viewBox"
    :style="{ '--k': k }"
    role="group"
    :aria-label="title"
    preserveAspectRatio="xMidYMid meet"
  >
    <defs>
      <pattern :id="`hatch-${uid}`" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="7" stroke="#24251f" stroke-opacity=".07" stroke-width="1.2" />
      </pattern>
      <clipPath :id="`clip-${uid}`"><path :d="GUJARAT" /></clipPath>
    </defs>

    <!-- Graticule -->
    <g class="graticule" aria-hidden="true">
      <line v-for="g in graticule.lons" :key="'lon' + g.lon" :x1="g.x" :x2="g.x" :y1="-200" :y2="VIEW.height + 200" />
      <line v-for="g in graticule.lats" :key="'lat' + g.lat" :y1="g.y" :y2="g.y" :x1="-200" :x2="VIEW.width + 200" />
      <text v-for="g in graticule.lats" :key="'latl' + g.lat" :x="vb.x + 10 * k" :y="g.y - 5 * k">{{ g.lat }}°N</text>
      <text v-for="g in graticule.lons" :key="'lonl' + g.lon" :x="g.x + 5 * k" :y="vb.y + 18 * k">{{ g.lon }}°E</text>
    </g>

    <!-- Water-lining along the coast: the vintage atlas ripple -->
    <!-- (each ring = a wide sage stroke covered by a slightly narrower paper stroke → a thin line) -->
    <g class="waterline" aria-hidden="true">
      <template v-for="w in [44, 32, 22, 13]" :key="w">
        <path :d="GUJARAT" class="wl" :style="{ strokeWidth: w * k + 'px' }" />
        <path :d="GUJARAT" class="wl-gap" :style="{ strokeWidth: (w - 2.2) * k + 'px' }" />
      </template>
    </g>

    <!-- Neighbouring states, quietly hatched -->
    <path class="neighbours-fill" :d="NEIGHBOURS" aria-hidden="true" />
    <path class="neighbours" :d="NEIGHBOURS" :fill="`url(#hatch-${uid})`" aria-hidden="true" />

    <!-- Gujarat -->
    <g aria-hidden="true">
      <path class="land" :d="GUJARAT" />
      <path class="land land--hatch" :d="GUJARAT" :style="{ fill: `url(#hatch-${uid})` }" />
      <path class="land" :d="ENCLAVES" />
      <!-- inner contour lines suggesting relief -->
      <g :clip-path="`url(#clip-${uid})`" class="contours">
        <template v-for="w in [70, 40]" :key="w">
          <path :d="GUJARAT" class="ct" :style="{ strokeWidth: w * k + 'px' }" />
          <path :d="GUJARAT" class="ct-gap" :style="{ strokeWidth: (w - 1.6) * k + 'px' }" />
        </template>
      </g>
    </g>

    <!-- Rivers -->
    <g class="rivers" aria-hidden="true">
      <path v-for="r in rivers" :key="r.name" :d="r.d" />
      <text v-for="r in rivers" :key="r.name + 'l'" :x="r.label[0]" :y="r.label[1]" :style="{ fontSize: 13 * k + 'px' }">{{ r.name }}</text>
    </g>

    <!-- Sea labels -->
    <g class="sea" aria-hidden="true">
      <text v-for="s in seaLabels" :key="s.text" :x="s.xy[0]" :y="s.xy[1]"
        :transform="s.rotate ? `rotate(${s.rotate} ${s.xy[0]} ${s.xy[1]})` : undefined"
        :style="{ fontSize: s.size * k + 'px' }">{{ s.text }}</text>
    </g>

    <!-- Roads: casing, then the route drawn over -->
    <g aria-hidden="true">
      <path class="road-casing" :d="corridorPath" />
      <path class="road-casing road-casing--minor" :d="spurPath" />
      <path class="road" :d="corridorPath" />
      <path class="road road--minor" :d="spurPath" />
      <path class="route" :d="corridorPath" pathLength="1" :style="{ strokeDashoffset: 1 - corridorProgress }" />
      <path class="route route--spur" :d="spurPath" pathLength="1" :style="{ strokeDashoffset: 1 - spurProgress }" />
    </g>

    <!-- Road shields & distances -->
    <g class="shields" aria-hidden="true" :style="{ opacity: corridorProgress > 0.3 ? 1 : 0 }">
      <g v-for="s in shields" :key="s.label" :transform="`translate(${s.xy[0]} ${s.xy[1]}) scale(${k})`">
        <rect :x="s.small ? -34 : -24" y="-10" :width="s.small ? 68 : 48" height="20" rx="2" :class="{ small: s.small }" />
        <text y="4" text-anchor="middle">{{ s.label }}</text>
      </g>
    </g>
    <g v-if="showDistances" class="distances" aria-hidden="true" :style="{ opacity: zoom > 0.6 ? 1 : 0 }">
      <text v-for="l in legLabels" :key="l.id" :x="l.xy[0] + 10 * k" :y="l.xy[1]" :style="{ fontSize: 9.5 * k + 'px' }">≈{{ l.km }} km</text>
    </g>

    <!-- Places -->
    <g
      v-for="m in markers"
      :key="m.id"
      class="place"
      :class="{ 'is-visible': visible(m.id), 'is-active': current === m.id, 'is-highlight': highlight.includes(m.id), [`place--${m.label}`]: true }"
      :data-place="m.id"
      :transform="`translate(${m.xy[0]} ${m.xy[1]}) scale(${mk})`"
      :tabindex="interactive && visible(m.id) ? 0 : -1"
      :role="interactive ? 'button' : undefined"
      :aria-label="interactive ? `${m.name}. ${m.note}.` : undefined"
      :aria-pressed="interactive ? active === m.id : undefined"
      @click="select(m.id)"
      @keydown="onKey($event, m.id)"
      @mouseenter="hovered = m.id"
      @mouseleave="hovered = null"
    >
      <circle class="hit" r="26" />
      <circle class="ring" r="9" />
      <circle class="dot" r="3.6" />
      <!-- small illustrated landmarks -->
      <g v-if="m.landmark === 'statue'" class="glyph" transform="translate(-4 -48)">
        <path d="M4 0 L5.5 3 L5 8 L8 12 L7 30 L9 34 L-1 34 L1 30 L0 12 L3 8 L2.5 3 Z" />
        <path d="M-6 36 H14" />
      </g>
      <g v-else-if="m.landmark === 'palace'" class="glyph" transform="translate(-16 -46)">
        <path d="M0 30 V16 H32 V30 M4 16 V10 H28 V16 M10 10 Q16 -2 22 10 M16 2 V-2 M-2 30 H34" />
        <path d="M2 16 V6 M30 16 V6 M2 6 L0 4 L2 2 L4 4 Z M30 6 L28 4 L30 2 L32 4 Z" />
      </g>
      <g v-else-if="m.landmark === 'arch'" class="glyph" transform="translate(-12 -46)">
        <path d="M0 30 V12 Q12 -4 24 12 V30 Z" />
        <path d="M12 30 V14 M12 22 Q6 16 4 22 M12 20 Q18 14 20 20 M12 26 Q7 22 5 27 M12 25 Q17 21 19 26" />
      </g>
      <g class="label" :transform="m.label === 'left' ? 'translate(-18 0)' : 'translate(18 0)'">
        <text class="name" :text-anchor="m.label === 'left' ? 'end' : 'start'" y="2">{{ m.name }}</text>
        <text class="gu" :text-anchor="m.label === 'left' ? 'end' : 'start'" y="18">{{ m.gujarati }}</text>
        <text class="note" :text-anchor="m.label === 'left' ? 'end' : 'start'" y="32">{{ m.note }}</text>
      </g>
    </g>

    <!-- Compass and scale, pinned to the current frame -->
    <g class="compass" aria-hidden="true" :transform="`translate(${compass.x} ${compass.y}) scale(${k})`">
      <circle r="26" />
      <path d="M0 -36 L6 0 L0 6 L-6 0 Z" class="needle" />
      <path d="M0 36 L6 0 L-6 0 Z" />
      <text y="-42" text-anchor="middle">N</text>
    </g>
    <g class="scalebar" aria-hidden="true" :transform="`translate(${scaleBar.x} ${scaleBar.y})`">
      <rect :width="SCALE_50KM / 2" :height="5 * k" class="a" />
      <rect :x="SCALE_50KM / 2" :width="SCALE_50KM / 2" :height="5 * k" class="b" />
      <text :y="-7 * k" :style="{ fontSize: 9 * k + 'px' }">0</text>
      <text :x="SCALE_50KM" :y="-7 * k" text-anchor="end" :style="{ fontSize: 9 * k + 'px' }">50 km</text>
    </g>
  </svg>
</template>

<style scoped>
.atlas {
  width: 100%;
  height: auto;
  aspect-ratio: 1310 / 1000;
  overflow: hidden;
  font-family: var(--font-body);
  user-select: none;
}
.graticule line { stroke: var(--ink); stroke-opacity: 0.07; stroke-width: calc(1px * var(--k)); }
.graticule text { font-family: var(--font-mono); font-size: calc(9px * var(--k)); fill: var(--ink-faint); letter-spacing: 0.08em; }

.waterline path { fill: none; stroke-linejoin: round; }
.waterline .wl { stroke: #7f9a93; stroke-opacity: 0.55; }
.waterline .wl-gap { stroke: var(--paper); }
.neighbours-fill { fill: var(--paper); stroke: var(--paper); stroke-width: calc(2px * var(--k)); }
.neighbours { stroke: var(--ink); stroke-opacity: 0.22; stroke-width: calc(0.8px * var(--k)); stroke-dasharray: calc(4px * var(--k)) calc(3px * var(--k)); }
.land { fill: var(--paper-deep); stroke: var(--ink); stroke-width: calc(1.3px * var(--k)); stroke-linejoin: round; }
.land--hatch { stroke: none; opacity: 0.5; }
.contours path { fill: none; stroke-linejoin: round; }
.contours .ct { stroke: var(--mustard); stroke-opacity: 0.5; }
.contours .ct-gap { stroke: var(--paper-deep); }

.rivers path { fill: none; stroke: #6f8c86; stroke-opacity: 0.75; stroke-width: calc(1.6px * var(--k)); stroke-linecap: round; }
.rivers text, .sea text { font-family: var(--font-display); font-style: italic; fill: #5b7a74; letter-spacing: 0.04em; }
.sea text { fill: #7d958f; letter-spacing: 0.2em; }

.road-casing { fill: none; stroke: var(--ink); stroke-width: calc(6px * var(--k)); stroke-linecap: round; stroke-opacity: 0.85; }
.road-casing--minor { stroke-width: calc(4.4px * var(--k)); stroke-opacity: 0.6; }
.road { fill: none; stroke: var(--paper); stroke-width: calc(3.6px * var(--k)); stroke-linecap: round; }
.road--minor { stroke-width: calc(2.2px * var(--k)); }
.route { fill: none; stroke: var(--terracotta); stroke-width: calc(3.6px * var(--k)); stroke-linecap: round; stroke-dasharray: 1 1; }
.route--spur { stroke-width: calc(2.2px * var(--k)); }

.shields { transition: opacity 0.6s; }
.shields rect { fill: var(--forest); }
.shields rect.small { fill: var(--paper); stroke: var(--forest); stroke-width: 1; }
.shields text { font-family: var(--font-mono); font-size: 10px; fill: var(--paper); letter-spacing: 0.1em; }
.shields .small + text { fill: var(--forest); font-size: 9px; }
.distances { transition: opacity 0.6s; }
.distances text { font-family: var(--font-mono); fill: var(--terracotta-ink); }

.place { opacity: 0; transition: opacity 0.5s var(--ease-out); pointer-events: none; outline: none; }
.place.is-visible { opacity: 1; pointer-events: auto; }
.is-interactive .place { cursor: pointer; }
.hit { fill: transparent; }
.ring { fill: var(--paper); stroke: var(--ink); stroke-width: 1.4; transition: r 0.3s var(--ease-out), stroke 0.3s; }
.dot { fill: var(--terracotta); transition: r 0.3s var(--ease-out); }
.glyph path { fill: var(--paper); stroke: var(--ink); stroke-width: 1.1; stroke-linejoin: round; stroke-linecap: round; }
.label .name { font-family: var(--font-display); font-size: 21px; fill: var(--ink); transition: fill 0.3s; }
.label .gu { font-family: 'Noto Serif Gujarati', var(--font-display); font-size: 11px; fill: var(--ink-soft); }
.label .note { font-family: var(--font-mono); font-size: 8.5px; letter-spacing: 0.12em; text-transform: uppercase; fill: var(--ink-faint); }

.place.is-active .ring, .place:focus-visible .ring { r: 13; stroke: var(--terracotta); stroke-width: 2; }
.place.is-active .dot, .place:focus-visible .dot { r: 5; }
.place.is-active .name, .place:focus-visible .name { fill: var(--terracotta-ink); }
.place:focus-visible .hit { stroke: var(--terracotta); stroke-width: 1.5; stroke-dasharray: 3 3; }
.place.is-highlight .ring { fill: var(--mustard); }

.compass circle { fill: none; stroke: var(--ink); stroke-opacity: 0.3; }
.compass path { fill: var(--paper); stroke: var(--ink); stroke-width: 1; }
.compass .needle { fill: var(--ink); }
.compass text { font-family: var(--font-display); font-size: 16px; fill: var(--ink); }
.scalebar rect { stroke: var(--ink); stroke-width: calc(0.8px * var(--k)); }
.scalebar .a { fill: var(--ink); }
.scalebar .b { fill: var(--paper); }
.scalebar text { font-family: var(--font-mono); fill: var(--ink-soft); }
</style>
