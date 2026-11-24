import { createApp } from 'vue'
import './styles/tokens.css'
import './styles/base.css'
import './styles/forms.css'
import App from './App.vue'
import { router } from './router'

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.classList.add('js-motion')
}

createApp(App).use(router).mount('#app')
