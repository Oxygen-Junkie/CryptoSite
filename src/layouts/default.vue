<script setup lang="ts">
import LoadCircle from '~/components/loadCircle.vue'
import modal from '~/components/modal/modal.vue'
import { useStateStore } from '~/stores/state'
import { useFlagStore } from '~/stores/flags'

const { t } = useI18n()

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
      ? `${t('layout.userData')} ${
          (state.loadingItems || state.loadingDeals) ? ` ${t('layout.and')}` : ''
        }`
      : ''
  }`,
)

const textForLItems = ref(
  `${
    state.loadingItems
      ? ` ${t('layout.itemData')} ${state.loadingDeals ? ` ${t('layout.and')}` : ''}`
      : ''
  }`,
)

const textForLDeals = ref(`${state.loadingDeals ? ` ${t('layout.dealData')}` : ''}`)
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
        {{ `${t('layout.loading')} ${textForLUser} ${textForLItems} ${textForLDeals}` }}
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
