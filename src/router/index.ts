
import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'

const title = (t: string) => `${t} — Aapnu Safar`

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: HomePage, meta: { title: 'Aapnu Safar — Your Family. Our Responsibility.' } },
    { path: '/how-it-works', component: () => import('../pages/HowItWorksPage.vue'), meta: { title: title('How it works') } },
    { path: '/exclusive-family-travel', component: () => import('../pages/ExclusiveTravelPage.vue'), meta: { title: title('Exclusive family travel') } },
    { path: '/discover-gujarat', component: () => import('../pages/DiscoverPage.vue'), meta: { title: title('Discover Gujarat') } },
    { path: '/plan-your-journey', component: () => import('../pages/PlanJourneyPage.vue'), meta: { title: title('Plan your journey') } },
    { path: '/about', component: () => import('../pages/AboutPage.vue'), meta: { title: title('About') } },
    { path: '/contact', component: () => import('../pages/ContactPage.vue'), meta: { title: title('Contact') } },
    { path: '/credits', component: () => import('../pages/CreditsPage.vue'), meta: { title: title('Photo credits') } },
    { path: '/:pathMatch(.*)*', component: () => import('../pages/NotFoundPage.vue'), meta: { title: title('Off the map') } },
  ],
  scrollBehavior(to, _from, saved) {
    if (saved) return saved
    if (to.hash) return { el: to.hash, top: 90 }
    return { top: 0 }
  },
})

router.afterEach(to => {
  document.title = (to.meta.title as string) ?? 'Aapnu Safar'
})
