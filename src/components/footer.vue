<script setup lang="ts">
import { availableLocales } from '~/modules/i18n'

const { t, locale } = useI18n()

async function toggleLocales() {
  const locales = availableLocales
  const newLocale = locales[(locales.indexOf(locale.value) + 1) % locales.length]
  locale.value = newLocale
}
</script>

<template>
  <footer class="p-6 text-center">
    <button :class="`${locale.includes('ru') ? 'i-circle-flags-en' : 'i-circle-flags-ru'} mr-10`" :title="t('footer.lang')" @click="toggleLocales()" /> &nbsp;
    {{ t('footer.SSTU') }} | @Oxygen-Junkie - 2023
    <button class="i-carbon-sun dark:i-carbon-moon ml-10" :title="t('footer.dis')" @click="toggleDark()" /> &nbsp;
  </footer>
</template>

<style>
footer {
  background-color: black;
  color: white;
}
</style>
