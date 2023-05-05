export default defineNuxtPlugin((nuxtApp: any) => {
  // when page redirect on mobile device, close drawer navbar
  nuxtApp.hook('page:finish', () => {
    const showDrawer = useState<boolean>('navbar.showDrawer', () => false)
    const showOptions = useState<boolean>('navbar.showOptions', () => false)
    showDrawer.value = false
    showOptions.value = false
  })
})
