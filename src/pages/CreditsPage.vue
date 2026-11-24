<script setup lang="ts">
import PageHeader from '../components/editorial/PageHeader.vue'
import { photos } from '../data/photos'
const list = Object.values(photos)
</script>

<template>
  <div>
    <PageHeader no="—" kicker="Credits" lede="Photographs from Wikimedia Commons, used under their stated licences. Our cropped and resized versions of share-alike (BY-SA) images are published under the same licence.">
      With thanks <span class="italic">to the photographers.</span>
    </PageHeader>
    <section class="credits">
      <div class="frame">
        <table class="tbl">
          <thead><tr><th scope="col">Subject</th><th scope="col">Photographer</th><th scope="col">Licence</th><th scope="col">Source</th></tr></thead>
          <tbody>
            <tr v-for="p in list" :key="p.key">
              <td>{{ p.place }}<span class="alt">{{ p.alt }}</span></td>
              <td>{{ p.credit.author }}</td>
              <td><a v-if="p.credit.licenseUrl" :href="p.credit.licenseUrl" target="_blank" rel="noopener license">{{ p.credit.license }}</a><template v-else>{{ p.credit.license }}</template><span v-if="'shareAlike' in p && p.shareAlike" class="alt">Cropped &amp; resized; same licence</span></td>
              <td><a :href="p.credit.source" target="_blank" rel="noopener">Wikimedia Commons</a></td>
            </tr>
          </tbody>
        </table>
        <div class="other">
          <p><strong>Map.</strong> The Gujarat outline is derived from <a href="https://www.naturalearthdata.com/" target="_blank" rel="noopener">Natural Earth</a> (public domain). Rivers, roads and landmarks are illustrative and approximate.</p>
          <p><strong>Type.</strong> Instrument Serif, Manrope, JetBrains Mono and Noto Serif Gujarati, all under the SIL Open Font License.</p>
          <p><strong>Vehicle photograph.</strong> Cropped to remove a third-party sticker and the manufacturer’s badge.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.credits { padding-block: var(--section); }
.tbl { width: 100%; border-collapse: collapse; font-size: 0.92rem; }
.tbl th { text-align: left; font-family: var(--font-mono); font-weight: 400; font-size: 0.66rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink-faint); padding: 0.6rem 1rem 0.6rem 0; border-bottom: 1px solid var(--rule-strong); }
.tbl td { padding: 0.9rem 1rem 0.9rem 0; border-bottom: 1px solid var(--rule); vertical-align: top; }
.alt { display: block; font-size: 0.78rem; color: var(--ink-faint); margin-top: 0.2rem; }
.other { margin-top: 3rem; max-width: 64ch; color: var(--ink-soft); }
@media (max-width: 700px) {
  .tbl thead { display: none; }
  .tbl tr { display: grid; padding: 0.8rem 0; border-bottom: 1px solid var(--rule); }
  .tbl td { border: 0; padding: 0.15rem 0; }
}
</style>
