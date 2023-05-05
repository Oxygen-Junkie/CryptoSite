import type { NavigationGuard } from 'vue-router'
export type MiddlewareKey = string
declare module "C:/Users/FarmUser/Desktop/CryptoSite/node_modules/.pnpm/nuxt@3.4.3_@types+node@18.16.3_eslint@8.39.0_sass@1.62.1_typescript@5.0.4_vue-tsc@1.6.3/node_modules/nuxt/dist/pages/runtime/composables" {
  interface PageMeta {
    middleware?: MiddlewareKey | NavigationGuard | Array<MiddlewareKey | NavigationGuard>
  }
}