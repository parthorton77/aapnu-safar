// GSAP is loaded lazily so it never blocks the first render.
import type { Directive } from 'vue'

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

let loading: Promise<{ gsap: typeof import('gsap').gsap; ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger }> | null = null

export function loadGsap() {
  loading ??= Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([g, st]) => {
    g.gsap.registerPlugin(st.ScrollTrigger)
    return { gsap: g.gsap, ScrollTrigger: st.ScrollTrigger }
  })
  return loading
}

/**
 * v-reveal — editorial entrance: a short rise and fade, once.
 * v-reveal="0.15" sets a delay. Elements stay visible when motion is reduced.
 */
export const vReveal: Directive<HTMLElement, number | undefined> = {
  mounted(el, binding) {
    el.setAttribute('data-reveal', '')
    if (prefersReducedMotion()) { el.removeAttribute('data-reveal'); return }
    loadGsap().then(({ gsap }) => {
      gsap.to(el, {
        opacity: 1, y: 0, duration: 1.1, ease: 'power3.out', delay: binding.value ?? 0,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      })
    })
  },
}

/** v-parallax="0.12" — gentle vertical drift for images inside an overflow-hidden frame (desktop only). */
export const vParallax: Directive<HTMLElement, number | undefined> = {
  mounted(el, binding) {
    if (prefersReducedMotion() || window.matchMedia('(max-width: 899px)').matches) return
    const amount = (binding.value ?? 0.1) * 100
    loadGsap().then(({ gsap }) => {
      gsap.fromTo(el, { yPercent: -amount / 2 }, {
        yPercent: amount / 2, ease: 'none',
        scrollTrigger: { trigger: el.parentElement ?? el, start: 'top bottom', end: 'bottom top', scrub: true },
      })
    })
  },
}
