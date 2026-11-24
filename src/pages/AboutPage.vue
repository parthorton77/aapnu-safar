<script setup lang="ts">
import PageHeader from '../components/editorial/PageHeader.vue'
import EditorialPhoto from '../components/editorial/EditorialPhoto.vue'
import ClosingStatement from '../components/editorial/ClosingStatement.vue'
import { vReveal } from '../composables/motion'

const beliefs = [
  ['Plan it properly', 'A good journey is agreed before it starts: dates, hours, stops and price.'],
  ['Say what is true', 'No instant fares, no made-up availability, and no figures you haven’t seen.'],
  ['Care for the passenger', 'Elderly parents, small children, long flights: the plan bends around them.'],
  ['Keep the family informed', 'Whoever is arranging the trip, wherever they live, knows what is happening.'],
]
</script>

<template>
  <div>
    <PageHeader no="06" kicker="About Aapnu Safar" lede="“Aapnu” means “our” in Gujarati. “Safar” means journey. The name is the promise: your family’s journey, treated as if it were our own.">
      Our journey <span class="italic">is your family’s.</span>
    </PageHeader>

    <section class="story" data-chapter="06.1" data-chapter-title="Why we exist">
      <div class="frame story__grid">
        <div class="story__photo" v-reveal>
          <EditorialPhoto photo="ahmedabad-pol" ratio="4 / 5" :parallax="0.1" sizes="(min-width: 900px) 34vw, 92vw" />
        </div>
        <div class="story__text">
          <p class="meta" v-reveal>Why we exist</p>
          <h2 v-reveal>For the moment you hand over <span class="italic">the people you love.</span></h2>
          <p v-reveal>
            Gujarati families are spread across the world. When parents fly in from Toronto, or a cousin from Leicester
            lands in Ahmedabad, someone abroad is usually the one making arrangements, often at night, across time
            zones, hoping it all works out.
          </p>
          <p v-reveal>
            Aapnu Safar exists so that it does. We plan each journey with the family, reserve one vehicle and one driver
            for them, and keep everyone informed from the airport to the last drop-off.
          </p>
          <p class="story__tbc" v-reveal><span class="meta">Founders’ note</span> [To be confirmed: a short personal note from the people behind Aapnu Safar.]</p>
        </div>
      </div>
    </section>

    <section class="beliefs" data-chapter="06.2" data-chapter-title="What we believe">
      <div class="frame">
        <p class="meta" v-reveal>What we believe</p>
        <ol class="beliefs__list">
          <li v-for="(b, i) in beliefs" :key="b[0]" v-reveal="i * 0.06">
            <span class="beliefs__no">{{ i + 1 }}</span>
            <h3>{{ b[0] }}</h3>
            <p>{{ b[1] }}</p>
          </li>
        </ol>
      </div>
    </section>

    <ClosingStatement chapter="06.3" />
  </div>
</template>

<style scoped>
.story, .beliefs { padding-block: var(--section); border-bottom: 1px solid var(--rule); }
.story__grid { display: grid; gap: 3rem; }
.story__text h2 { font-size: var(--step-4); margin: 1rem 0 1.6rem; }
.story__text h2 .italic { color: var(--terracotta-ink); }
.story__text > p:not(.meta) { color: var(--ink-soft); max-width: 50ch; }
.story__tbc { border-left: 2px solid var(--mustard); padding-left: 1rem; font-size: 0.9rem; font-style: italic; }
.story__tbc .meta { display: block; font-style: normal; margin-bottom: 0.3rem; }
.beliefs__list { list-style: none; padding: 0; margin: 2rem 0 0; display: grid; gap: 0; }
.beliefs__list li { display: grid; grid-template-columns: 3.5rem 1fr; column-gap: 1rem; padding: 1.6rem 0; border-top: 1px solid var(--rule-strong); }
.beliefs__no { grid-row: span 2; font-family: var(--font-display); font-size: 3.4rem; line-height: 0.8; color: var(--terracotta-ink); }
.beliefs__list h3 { font-size: var(--step-2); }
.beliefs__list p { color: var(--ink-soft); margin: 0.4rem 0 0; max-width: 46ch; }
@media (min-width: 900px) {
  .story__grid { grid-template-columns: 5fr 6fr; column-gap: calc(var(--gutter) * 2); align-items: center; }
  .beliefs__list { grid-template-columns: 1fr 1fr; column-gap: calc(var(--gutter) * 2); }
  .beliefs__list li:nth-child(even) { transform: translateY(3rem); }
}
</style>
