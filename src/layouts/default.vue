<script setup lang="ts">
import LoadCircle from '~/components/loadCircle.vue'
import modal from '~/components/modal/modal.vue'
import { useStateStore } from '~/stores/state'
import { useFlagStore } from '~/stores/flags'

const state = useStateStore()
const flags = useFlagStore()

if (!state.isUserLogged) {
  state.connectWallet().then(() => {
    state.scanDeals()
    state.determineCurrency()
  })
}

const textForLUser = ref(
  `${
    state.loadingUser
      ? `данные о пользователе ${
          (state.loadingItems || state.loadingDeals) ? ' и' : ''
        }`
      : ''
  }`,
)

const textForLItems = ref(
  `${
    state.loadingItems
      ? ` данные о товаре ${state.loadingDeals ? ' и' : ''}`
      : ''
  }`,
)

const textForLDeals = ref(`${state.loadingDeals ? ' данные о сделках' : ''}`)
</script>

<template>
  <main>
    <div
      v-if="
        state.isUserLogged
          || state.loadingDeals
          || state.loadingUser
          || state.loadingItems
      "
      class="text-center"
    >
      <h4>
        {{ `Загружаются ${textForLUser} ${textForLItems} ${textForLDeals}` }}
      </h4>
      <LoadCircle class="h-100 w-100" />
    </div>

    <div v-else>
      <modal v-if="flags.modal" :modal-mode="flags.modalMode" :item="flags.item" />
      <div :class="{ 'b blur': flags.modal }">
        <Navbar />
        <RouterView />
        <Footer />
      </div>
    </div>
  </main>
</template>

<style scoped>
.b.blur {
  filter: blur(1rem);
  pointer-events: none;
  overflow-y: hidden;
}
</style>
