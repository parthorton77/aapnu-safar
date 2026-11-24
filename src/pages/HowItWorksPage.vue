<script setup lang="ts">
import PageHeader from '../components/editorial/PageHeader.vue'
import JourneySteps from '../components/editorial/JourneySteps.vue'
import TermsLedger from '../components/editorial/TermsLedger.vue'
import ClosingStatement from '../components/editorial/ClosingStatement.vue'
import { lifecycle } from '../data/process'
import { vReveal } from '../composables/motion'
</script>

<template>
  <div>
    <PageHeader no="02" kicker="How it works" lede="A journey with Aapnu Safar is agreed before it begins. Here is exactly how an enquiry becomes a confirmed trip, and what is decided at each stop.">
      From your plans <span class="italic">to the open road.</span>
    </PageHeader>

    <section class="block" data-chapter="02.1" data-chapter-title="Five stops">
      <div class="frame">
        <p class="meta block__mark" v-reveal>The five stops</p>
        <JourneySteps />
      </div>
    </section>

    <section class="block life" data-chapter="02.2" data-chapter-title="The lifecycle">
      <div class="frame life__grid">
        <div>
          <p class="meta" v-reveal>Behind the scenes</p>
          <h2 class="block__title" v-reveal>Every status is <span class="italic">a person’s decision.</span></h2>
          <p class="block__text" v-reveal>Nothing on this website books a vehicle automatically. Your enquiry moves through these stages only when you and our team agree it should.</p>
        </div>
        <ol class="life__line" aria-label="Booking lifecycle">
          <li v-for="(s, i) in lifecycle" :key="s" v-reveal="i * 0.05">
            <span class="meta">{{ String(i + 1).padStart(2, '0') }}</span><span class="life__s">{{ s }}</span>
            <span v-if="i === 0" class="life__you meta">You send</span>
            <span v-else-if="i === 3" class="life__you meta">You decide</span>
          </li>
        </ol>
      </div>
    </section>

    <section id="terms" class="block" data-chapter="02.3" data-chapter-title="Terms, plainly">
      <div class="frame">
        <p class="meta" v-reveal>Terms, plainly</p>
        <h2 class="block__title" v-reveal>What’s agreed <span class="italic">before you travel.</span></h2>
        <p class="block__text" v-reveal>Every figure that applies to your trip is written into your quotation. Where a detail below says “To be confirmed”, the policy is still being finalised and will be stated in full before you book.</p>
        <TermsLedger />
      </div>
    </section>

    <ClosingStatement chapter="02.4" />
  </div>
</template>

<style scoped>
.block { padding-block: var(--section); border-bottom: 1px solid var(--rule); }
.block__mark { margin-bottom: 3rem; }
.block__title { font-size: var(--step-4); margin: 1rem 0 1.4rem; max-width: 16ch; }
.block__title .italic { color: var(--terracotta-ink); }
.block__text { color: var(--ink-soft); max-width: 52ch; margin-bottom: 3rem; }
.life { background: var(--paper-deep); }
.life__grid { display: grid; gap: 3rem; }
.life__line { list-style: none; margin: 0; padding: 0 0 0 1.4rem; border-left: 2px dashed var(--rule-strong); display: grid; gap: 0; }
.life__line li { display: flex; align-items: baseline; gap: 1rem; padding: 0.75rem 0; position: relative; border-bottom: 1px solid var(--rule); }
.life__line li::before { content: ''; position: absolute; left: calc(-1.4rem - 7px); top: 1.15rem; width: 12px; height: 12px; border-radius: 50%; background: var(--paper); border: 2px solid var(--ink); }
.life__line li:last-child::before { background: var(--terracotta); border-color: var(--terracotta); }
.life__s { font-family: var(--font-display); font-size: var(--step-2); }
.life__you { margin-left: auto; color: var(--terracotta-ink); }
@media (min-width: 900px) { .life__grid { grid-template-columns: 1fr 1fr; align-items: start; column-gap: calc(var(--gutter) * 2); } }
</style>
