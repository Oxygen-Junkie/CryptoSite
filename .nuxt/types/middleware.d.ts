import type { NavigationGuard } from 'vue-router'
export type MiddlewareKey = string
declare module "C:/Users/FarmUser/Desktop/Web3-Starter-Template/node_modules/.pnpm/nuxt@3.3.2_@types+node@18.11.12_eslint@8.39.0_sass@1.62.1_typescript@5.0.4_vue-tsc@1.6.3/node_modules/nuxt/dist/pages/runtime/composables" {
  interface PageMeta {
    middleware?: MiddlewareKey | NavigationGuard | Array<MiddlewareKey | NavigationGuard>
  }
}