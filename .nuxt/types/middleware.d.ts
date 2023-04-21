import type { NavigationGuard } from 'vue-router'
export type MiddlewareKey = string
declare module "C:/Users/FarmUser/Desktop/CryptoSite/node_modules/.pnpm/nuxt@3.3.2_f2jg2oarjqn3eorqpz46zpgb2a/node_modules/nuxt/dist/pages/runtime/composables" {
  interface PageMeta {
    middleware?: MiddlewareKey | NavigationGuard | Array<MiddlewareKey | NavigationGuard>
  }
}