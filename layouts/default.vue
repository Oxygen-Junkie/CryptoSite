<script setup lang="ts">
import LoadCircle from '~~/components/loadCircle.vue'
import { useStateStore } from '~~/store/state'

const state = useStateStore()

if (state.isUserLogged) {
  state.connectWallet().then(() => {
    state.scanDeals()
    state.determineCurrency()
  })
}

const textForLUser = ref(
  `${
    state.loadingUser
      ? `данные о пользователе ${
          state.loadingItems || state.loadingDeals ? ` и` : ``
        }`
      : ``
  }`
)

const textForLItems = ref(
  `${
    state.loadingItems
      ? ` данные о товаре ${state.loadingDeals ? ` и` : ``}`
      : ``
  }`
)

const textForLDeals = ref(`${state.loadingDeals ? ` данные о сделках` : ``}`)
</script>

<template>
  <Navbar />
  <div
    v-if="
      state.isUserLogged ||
      state.loadingDeals ||
      state.loadingUser ||
      state.loadingItems
    "
    class="text-center"
  >
    <h4>
      {{ `Загружаются ${textForLUser} ${textForLItems} ${textForLDeals}` }}
    </h4>
    <LoadCircle class="w-100 h-100" />
  </div>
  <slot v-else />

  <Footer />
</template>
