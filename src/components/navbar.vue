<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div id="nav" class="sticky-top bg-red-700 text-center">
    <nav>
      <span class="flex items-center justify-center">
        <router-link
          class="mr-2 w-80 border border-b-4 border-r-4 border-black px-10 py-2 font-medium shadow-lg hover:shadow-sm"
          to="/"
        >
          <span class="flex items-center justify-center"><span class="i-iconoir-3d-select-face" />&nbsp; {{ t('head_goods') }}
          </span>
        </router-link>
        <router-link
          class="mr-2 w-80 border border-b-4 border-r-4 border-black px-10 py-2 font-medium shadow-lg hover:shadow-sm"
          to="/deals"
        >
          <span class="flex items-center justify-center"><span class="i-fluent-handshake-24-regular" />&nbsp; {{ t('head_deals') }}
          </span>
        </router-link>
        <router-link
          class="mr-2 w-80 border border-b-4 border-r-4 border-black px-10 py-2 font-medium shadow-lg hover:shadow-sm"
          to="/posted"
        >
          <span class="flex items-center justify-center"><span class="i-ph-paperclip" />&nbsp; {{ t('head_posted') }}
          </span>
        </router-link>
      </span>
    </nav>
  </div>
</template>

<style scoped>
nav {
  padding: 1%;
}

nav ion-icon,
a {
  color: white;
  font-size: 20pt;
  padding-inline: 1%;
}
</style>
