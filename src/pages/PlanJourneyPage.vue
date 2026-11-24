<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import PageHeader from '../components/editorial/PageHeader.vue'
import EnquiryBuilder from '../components/itinerary/EnquiryBuilder.vue'
import { processSteps } from '../data/process'

const route = useRoute()
const addPlace = computed(() => (typeof route.query.add === 'string' ? route.query.add : undefined))
</script>

<template>
  <div>
    <PageHeader no="05" kicker="Plan your journey" lede="Share your family’s plans and we’ll review them personally. You’ll receive a clear quotation. Nothing is booked, and nothing is charged, until you accept it.">
      Your journey, <span class="italic">in your words.</span>
    </PageHeader>

    <section class="plan" data-chapter="05.1" data-chapter-title="Itinerary enquiry">
      <div class="frame plan__grid">
        <div class="plan__builder"><EnquiryBuilder :add-place="addPlace" /></div>
        <aside class="plan__aside" aria-label="What happens after you send">
          <p class="meta">After you send</p>
          <ol>
            <li v-for="(s, i) in processSteps.slice(1)" :key="s.title"><span class="meta">{{ String(i + 2).padStart(2, '0') }}</span> {{ s.title }}</li>
          </ol>
          <p class="plan__small">Prefer to talk first? <RouterLink to="/contact">Contact us</RouterLink>.</p>
        </aside>
      </div>
    </section>
  </div>
</template>

<style scoped>
.plan { padding-block: clamp(3rem, 6vw, 6rem) var(--section); background: var(--paper-deep); }
.plan__grid { display: grid; gap: 3rem; }
.plan__builder { min-width: 0; }
.plan__aside ol { list-style: none; padding: 0; margin: 1rem 0; border-top: 1px solid var(--rule-strong); }
.plan__aside li { padding: 0.7rem 0; border-bottom: 1px solid var(--rule); font-family: var(--font-display); font-size: 1.3rem; display: flex; gap: 0.8rem; align-items: baseline; }
.plan__small { font-size: 0.9rem; color: var(--ink-soft); }
@media (min-width: 1100px) {
  .plan__grid { grid-template-columns: minmax(0, 1fr) 15rem; align-items: start; }
  .plan__aside { position: sticky; top: 6.5rem; }
}
</style>
