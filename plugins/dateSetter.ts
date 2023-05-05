import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { NuxtPlugin } from 'nuxt/schema'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('VueDatePicker', VueDatePicker)
})
