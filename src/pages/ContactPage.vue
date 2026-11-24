<script setup lang="ts">
import PageHeader from '../components/editorial/PageHeader.vue'
import TbcValue from '../components/common/TbcValue.vue'
import GujaratAtlas from '../components/map/GujaratAtlas.vue'
import { business, contactLinks } from '../config/business'
import { vReveal } from '../composables/motion'
const contact = business.contact
</script>

<template>
  <div>
    <PageHeader no="07" kicker="Contact" lede="The quickest way to a quotation is to send your itinerary. If you’d rather talk it through first, reach us here.">
      Write to us, <span class="italic">from wherever you are.</span>
    </PageHeader>

    <section class="contact" data-chapter="07.1" data-chapter-title="Get in touch">
      <div class="frame contact__grid">
        <dl class="contact__list">
          <div v-reveal><dt class="meta">WhatsApp</dt><dd><TbcValue :detail="contact.whatsapp" :href="contactLinks.whatsapp" /></dd></div>
          <div v-reveal="0.05"><dt class="meta">Phone</dt><dd><TbcValue :detail="contact.phone" :href="contactLinks.phone" /></dd></div>
          <div v-reveal="0.1"><dt class="meta">Email</dt><dd><TbcValue :detail="contact.email" :href="contactLinks.email" /></dd></div>
          <div v-reveal="0.15"><dt class="meta">Based in</dt><dd><TbcValue :detail="contact.baseCity" /></dd></div>
          <div v-reveal="0.2"><dt class="meta">Response hours (IST)</dt><dd><TbcValue :detail="contact.hours" /></dd></div>
        </dl>

        <div class="contact__side">
          <div class="contact__map" v-reveal>
            <GujaratAtlas :progress="1" :zoom="0.65" :interactive="false" :show-distances="false" title="Map of the Aapnu Safar service corridor in Gujarat" />
            <p class="meta">Service corridor · Ahmedabad to Surat, and Ekta Nagar</p>
          </div>
          <div class="contact__cta" v-reveal>
            <h2>Have dates in mind?</h2>
            <p>Send your plan and we’ll come back with a personal quotation.</p>
            <RouterLink to="/plan-your-journey" class="cta cta--solid">Plan your journey <span class="cta__arrow" aria-hidden="true">→</span></RouterLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.contact { padding-block: var(--section); }
.contact__grid { display: grid; gap: 4rem; }
.contact__list { margin: 0; border-top: 1px solid var(--rule-strong); }
.contact__list div { padding: 1.4rem 0; border-bottom: 1px solid var(--rule); }
.contact__list dd { margin: 0.4rem 0 0; font-family: var(--font-display); font-size: var(--step-3); line-height: 1.1; word-break: break-word; }
.contact__list dd :deep(.tbc) { font-size: 0.9rem; }
.contact__side { display: grid; gap: 3rem; }
.contact__map { border: 1px solid var(--rule); padding: 0.6rem; }
.contact__map .meta { margin-top: 0.4rem; }
.contact__cta h2 { font-size: var(--step-3); margin-bottom: 0.6rem; }
.contact__cta p { color: var(--ink-soft); }
@media (min-width: 900px) { .contact__grid { grid-template-columns: 1fr 1fr; column-gap: calc(var(--gutter) * 2); } }
</style>
