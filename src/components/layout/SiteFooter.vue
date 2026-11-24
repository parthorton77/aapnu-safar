<script setup lang="ts">
import { business, contactLinks } from '../../config/business'
import { navLinks } from '../navigation/nav'
import { places } from '../../data/places'
import TbcValue from '../common/TbcValue.vue'
import GujaratAtlas from '../map/GujaratAtlas.vue'

const contact = business.contact
const socials = Object.entries(business.social).filter(([, url]) => url)
const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="frame footer__grid">
      <div class="footer__brand">
        <p class="footer__name">Aapnu Safar</p>
        <p class="footer__tag italic">{{ business.tagline }}</p>
        <p class="footer__note">
          Exclusive, pre-arranged family travel across Gujarat. Every journey is reviewed by our team and quoted
          personally. Nothing is booked until you accept a quotation and payment is agreed.
        </p>
      </div>

      <div class="footer__col">
        <h2 class="meta">Contact</h2>
        <dl>
          <dt>WhatsApp</dt><dd><TbcValue :detail="contact.whatsapp" :href="contactLinks.whatsapp" /></dd>
          <dt>Phone</dt><dd><TbcValue :detail="contact.phone" :href="contactLinks.phone" /></dd>
          <dt>Email</dt><dd><TbcValue :detail="contact.email" :href="contactLinks.email" /></dd>
          <dt>Based in</dt><dd><TbcValue :detail="contact.baseCity" /></dd>
        </dl>
      </div>

      <div class="footer__col">
        <h2 class="meta">Service corridor</h2>
        <ul class="footer__places">
          <li v-for="p in places" :key="p.id">{{ p.name }}</li>
        </ul>
        <p class="footer__small">Other places on request, subject to itinerary review and availability.</p>
      </div>

      <nav class="footer__col" aria-label="Footer">
        <h2 class="meta">Navigate</h2>
        <ul class="footer__links">
          <li><RouterLink to="/plan-your-journey">Plan your journey</RouterLink></li>
          <li v-for="l in navLinks" :key="l.to"><RouterLink :to="l.to">{{ l.label }}</RouterLink></li>
          <li><RouterLink to="/credits">Photo credits</RouterLink></li>
          <li v-for="[name, url] in socials" :key="name"><a :href="url" target="_blank" rel="noopener" class="cap">{{ name }}</a></li>
        </ul>
      </nav>

      <div class="footer__atlas" aria-hidden="true">
        <GujaratAtlas :interactive="false" :show-distances="false" />
      </div>
    </div>
    <div class="frame footer__base">
      <span class="meta">© {{ year }} Aapnu Safar</span>
      <span class="meta">22.3072° N, 73.1812° E — Vadodara, on the way home</span>
    </div>
  </footer>
</template>

<style scoped>
.footer { background: var(--forest); color: var(--paper); padding-top: clamp(4rem, 8vw, 7rem); position: relative; z-index: 45; overflow: hidden; }
.footer .meta { color: var(--sage); }
.footer__grid { display: grid; gap: 3rem; grid-template-columns: 1fr; position: relative; }
.footer__name { font-family: var(--font-display); font-size: var(--step-4); line-height: 0.9; margin: 0; }
.footer__tag { font-family: var(--font-display); font-size: var(--step-1); color: var(--mustard); margin: 0.6rem 0 1.4rem; }
.footer__note { max-width: 40ch; color: rgb(244 240 231 / 0.75); font-size: var(--step--1); }
.footer__col h2 { margin-bottom: 1rem; font-weight: 400; }
dl { display: grid; grid-template-columns: auto 1fr; gap: 0.5rem 1rem; margin: 0; font-size: var(--step--1); }
dt { color: rgb(244 240 231 / 0.6); }
dd { margin: 0; }
dd a { color: var(--paper); }
.footer :deep(.tbc) { color: var(--mustard); background: rgb(198 164 91 / 0.14); }
.footer__places, .footer__links { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.35rem; font-size: var(--step--1); }
.footer__places li { font-family: var(--font-display); font-size: 1.25rem; line-height: 1.2; }
.footer__links a { color: var(--paper); text-decoration: none; border-bottom: 1px solid rgb(244 240 231 / 0.25); }
.footer__links a:hover { border-bottom-color: var(--mustard); }
.cap { text-transform: capitalize; }
.footer__small { font-size: 0.75rem; color: rgb(244 240 231 / 0.6); margin-top: 1rem; max-width: 26ch; }
.footer__atlas { position: absolute; right: -8%; top: -18%; width: 70%; opacity: 0.09; pointer-events: none; filter: invert(1) grayscale(1); mix-blend-mode: screen; }
.footer__base { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 1rem; margin-top: 4rem; padding-top: 1.4rem; padding-bottom: 1.6rem; border-top: 1px solid rgb(244 240 231 / 0.15); }

@media (min-width: 900px) {
  .footer__grid { grid-template-columns: 1.4fr 1fr 0.8fr 0.8fr; }
}
</style>
