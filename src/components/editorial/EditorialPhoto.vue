<script setup lang="ts">
// Responsive, lazily loaded photograph with an editorial caption and licence credit.
// If a file is missing, it shows an intentional illustrated plate instead of a broken image.
import { computed, ref } from 'vue'
import { photos, type PhotoKey } from '../../data/photos'
import { vParallax } from '../../composables/motion'

const props = withDefaults(defineProps<{
  photo: PhotoKey
  ratio?: string // CSS aspect-ratio, e.g. '4 / 5'
  sizes?: string
  priority?: boolean
  parallax?: number
  caption?: string
  label?: string // mono location label, defaults to the photo's place
  focus?: string
  credit?: 'inline' | 'hidden'
}>(), { ratio: '4 / 3', sizes: '(min-width: 900px) 50vw, 100vw', priority: false, parallax: 0, credit: 'inline' })

const p = computed(() => photos[props.photo])
const srcset = computed(() => [640, 1280, 1920].map(w => `/images/${p.value.key}-${w}.webp ${w}w`).join(', '))
const failed = ref(false)
</script>

<template>
  <figure class="photo">
    <div class="photo__frame" :style="{ aspectRatio: ratio }">
      <img
        v-if="!failed"
        v-parallax="parallax || undefined"
        :class="{ 'has-parallax': parallax }"
        :src="`/images/${p.key}-1280.webp`"
        :srcset="srcset"
        :sizes="sizes"
        :alt="p.alt"
        :loading="priority ? 'eager' : 'lazy'"
        :fetchpriority="priority ? 'high' : 'auto'"
        decoding="async"
        :style="{ objectPosition: focus ?? p.focus ?? '50% 50%' }"
        @error="failed = true"
      />
      <div v-else class="photo__plate" role="img" :aria-label="p.alt">
        <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <path v-for="i in 9" :key="i" :d="`M-20 ${40 + i * 26} C 90 ${10 + i * 28}, 200 ${80 + i * 22}, 420 ${30 + i * 27}`" />
        </svg>
        <span class="photo__plate-name">{{ p.place }}</span>
        <span class="meta">Photograph to follow</span>
      </div>
    </div>
    <figcaption v-if="caption || label !== '' || credit === 'inline'" class="photo__cap">
      <span class="meta meta--accent">{{ label ?? p.place }}</span>
      <span v-if="caption" class="photo__caption">{{ caption }}</span>
      <span v-if="credit === 'inline'" class="photo__credit">
        Photo: {{ p.credit.author }} ·
        <a v-if="p.credit.licenseUrl" :href="p.credit.licenseUrl" target="_blank" rel="noopener license">{{ p.credit.license }}</a>
        <template v-else>{{ p.credit.license }}</template>
        · <a :href="p.credit.source" target="_blank" rel="noopener">source</a>
      </span>
    </figcaption>
  </figure>
</template>

<style scoped>
.photo { margin: 0; }
.photo__frame { position: relative; overflow: hidden; background: var(--paper-shade); }
.photo__frame img { width: 100%; height: 100%; object-fit: cover; }
.photo__frame img.has-parallax { height: 116%; margin-top: -8%; }
.photo__plate {
  position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: flex-end; gap: 0.4rem;
  padding: 1.25rem; background: var(--forest); color: var(--paper);
}
.photo__plate svg { position: absolute; inset: 0; width: 100%; height: 100%; }
.photo__plate path { fill: none; stroke: var(--sage); stroke-opacity: 0.28; stroke-width: 1; }
.photo__plate-name { position: relative; font-family: var(--font-display); font-size: var(--step-2); line-height: 1; }
.photo__plate .meta { position: relative; color: var(--sage); }
.photo__cap { display: flex; flex-wrap: wrap; align-items: baseline; gap: 0.35rem 1rem; padding-top: 0.7rem; }
.photo__caption { font-size: var(--step--1); color: var(--ink-soft); flex: 1 1 18ch; }
.photo__credit { font-size: 0.68rem; color: var(--ink-faint); width: 100%; }
.photo__credit a { color: inherit; }
</style>
