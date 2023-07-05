import { ViteSSG } from 'vite-ssg'
import { setupLayouts } from 'virtual:generated-layouts'
import { VueRecaptchaPlugin } from 'vue-recaptcha'

// import Previewer from 'virtual:vue-component-preview'
import PrimeVue from 'primevue/config'
import App from './App.vue'
import type { UserModule } from './types'
import generatedRoutes from '~pages'

import '@unocss/reset/tailwind.css'
import './styles/main.css'
import 'uno.css'

const routes = setupLayouts(generatedRoutes)

// https://github.com/antfu/vite-ssg
export const createApp = ViteSSG(
  App,
  { routes, base: import.meta.env.BASE_URL },
  (ctx) => {
    // install all modules under `modules/`
    ctx.app.use(PrimeVue)
    Object.values(import.meta.glob<{ install: UserModule }>('./modules/*.ts', { eager: true }))
      .forEach(i => i.install?.(ctx))
    // ctx.app.use(Previewer)
    ctx.app.use(VueRecaptchaPlugin, {
      v2SiteKey: '6LeMVpUmAAAAAAFHvyzgft9X7XohthcSYxOVhY3R',
    })
  },
)
