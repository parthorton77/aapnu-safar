<script setup lang="ts">
import { vReveal } from '../../composables/motion'

const commitments = [
  ['One family reserves the vehicle', 'For your agreed dates the vehicle is yours alone. No pooling, and no seats sold to others.'],
  ['A dedicated driver for the trip', 'The same driver for the whole agreed journey, introduced to you before you travel.'],
  ['A planned itinerary and agreed hours', 'Daily plans, service hours and overnight stops are agreed in advance, so nobody is left guessing.'],
  ['No unrelated passengers', 'We never share your vehicle with strangers, not even for part of a day.'],
  ['A transparent quotation first', 'You see a clear quotation built on your actual itinerary before anything is confirmed.'],
  ['Personal communication throughout', 'We stay in touch before and during the trip, with you abroad and with your family in Gujarat.'],
]
</script>

<template>
  <section class="excl" data-chapter="04" data-chapter-title="Exclusive by design" aria-labelledby="excl-title">
    <div class="frame excl__grid">
      <div class="excl__statement">
        <p class="meta" v-reveal>04 — Exclusive by design</p>
        <h2 id="excl-title" class="excl__title" v-reveal>
          Reserved<span class="excl__dot">.</span><br />
          <span class="italic">For one family.</span>
        </h2>
        <p class="excl__lede" v-reveal>
          This is not a taxi you hail for a few hours. It’s a journey agreed in advance, with a vehicle and driver set
          aside for your people.
        </p>
      </div>

      <!-- the reservation ticket: an illustrated metaphor for the booking model -->
      <div class="ticket" v-reveal="0.15" aria-hidden="true">
        <div class="ticket__main">
          <div class="ticket__row ticket__top">
            <span>AAPNU SAFAR</span><span>RESERVATION</span>
          </div>
          <p class="ticket__family">The <span class="ticket__blank">&nbsp;</span> family</p>
          <dl class="ticket__fields">
            <div><dt>Passengers</dt><dd>Your family only</dd></div>
            <div><dt>Dates</dt><dd>As agreed</dd></div>
            <div><dt>Vehicle</dt><dd>Shared before travel</dd></div>
            <div><dt>Driver</dt><dd>Dedicated</dd></div>
            <div><dt>From</dt><dd>Your arrival point</dd></div>
            <div><dt>Via</dt><dd>Your itinerary</dd></div>
          </dl>
          <div class="ticket__row ticket__foot"><span>STATUS</span><span class="ticket__stamp">Quoted · then confirmed</span></div>
        </div>
        <div class="ticket__stub"><span>ROUTE 01</span><span>NOT SHARED</span></div>
      </div>

      <ol class="excl__list">
        <li v-for="([t, d], i) in commitments" :key="t" v-reveal="i * 0.05">
          <span class="excl__no">{{ String(i + 1).padStart(2, '0') }}</span>
          <div><h3>{{ t }}</h3><p>{{ d }}</p></div>
        </li>
      </ol>
      <p class="excl__more" v-reveal>
        <RouterLink to="/exclusive-family-travel" class="cta">How exclusive travel works, in full <span class="cta__arrow" aria-hidden="true">→</span></RouterLink>
      </p>
    </div>
  </section>
</template>

<style scoped>
.excl { background: var(--forest); color: var(--paper); padding-block: var(--section); position: relative; overflow: hidden; }
.excl .meta { color: var(--sage); }
.excl__grid { display: grid; gap: 3rem; grid-template-columns: minmax(0, 1fr); }
.excl__title { font-size: var(--step-5); line-height: 0.88; margin-top: 1.2rem; }
.excl__title .italic { color: var(--mustard); }
.excl__dot { color: var(--terracotta); }
.excl__lede { max-width: 38ch; font-size: var(--step-1); color: rgb(244 240 231 / 0.78); margin-top: 1.6rem; }

.ticket { display: flex; color: var(--ink); transform: rotate(1.6deg); max-width: 520px; filter: drop-shadow(0 26px 30px rgb(0 0 0 / 0.28)); }
.ticket__main { background: var(--paper); padding: 1.4rem 1.5rem; flex: 1; border-radius: 3px 0 0 3px;
  -webkit-mask: radial-gradient(circle at 100% 0, transparent 9px, #000 9.5px) top right / 51% 51% no-repeat, radial-gradient(circle at 100% 100%, transparent 9px, #000 9.5px) bottom right / 51% 51% no-repeat, linear-gradient(#000, #000) left / 50% 100% no-repeat;
  mask: radial-gradient(circle at 100% 0, transparent 9px, #000 9.5px) top right / 51% 51% no-repeat, radial-gradient(circle at 100% 100%, transparent 9px, #000 9.5px) bottom right / 51% 51% no-repeat, linear-gradient(#000, #000) left / 50% 100% no-repeat; }
.ticket__row { display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 0.62rem; letter-spacing: 0.16em; color: var(--ink-soft); }
.ticket__family { font-family: var(--font-display); font-size: 2.1rem; margin: 1rem 0; line-height: 1; }
.ticket__blank { display: inline-block; width: 5.5em; border-bottom: 1.5px solid var(--ink); }
.ticket__fields { display: grid; grid-template-columns: 1fr 1fr; gap: 0.7rem 1.2rem; margin: 0 0 1.2rem; padding: 1rem 0; border-block: 1px dashed var(--rule-strong); }
.ticket__fields dt { font-family: var(--font-mono); font-size: 0.58rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink-faint); }
.ticket__fields dd { margin: 0; font-weight: 600; font-size: 0.92rem; }
.ticket__stamp { color: var(--terracotta-ink); border: 1px solid currentColor; padding: 0.2rem 0.4rem; transform: rotate(-3deg); }
.ticket__stub { width: 3.2rem; background: var(--mustard); border-left: 2px dashed var(--forest); border-radius: 0 3px 3px 0;
  display: flex; flex-direction: column; justify-content: space-between; align-items: center; padding: 1rem 0;
  font-family: var(--font-mono); font-size: 0.6rem; letter-spacing: 0.18em; writing-mode: vertical-rl; }

.excl__list { list-style: none; margin: 0; padding: 0; display: grid; border-top: 1px solid rgb(244 240 231 / 0.2); }
.excl__list li { display: grid; grid-template-columns: 3.2rem 1fr; gap: 1rem; padding: 1.3rem 0; border-bottom: 1px solid rgb(244 240 231 / 0.2); }
.excl__no { font-family: var(--font-mono); font-size: 0.8rem; color: var(--mustard); padding-top: 0.4rem; }
.excl__list h3 { font-size: var(--step-2); }
.excl__list p { color: rgb(244 240 231 / 0.72); font-size: var(--step--1); margin: 0.45rem 0 0; max-width: 46ch; }
.excl__more .cta { color: var(--paper); }

@media (min-width: 900px) {
  .excl__grid { grid-template-columns: repeat(12, minmax(0, 1fr)); column-gap: var(--gutter); row-gap: 4rem; }
  .excl__statement { grid-column: 1 / 8; }
  .ticket { grid-column: 8 / 13; align-self: center; justify-self: end; width: 100%; }
  .excl__list { grid-column: 3 / 13; grid-template-columns: 1fr 1fr; column-gap: var(--gutter); }
  .excl__more { grid-column: 3 / 13; }
}
</style>
