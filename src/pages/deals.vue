<script setup lang="ts">
import type { Ref } from 'vue'
import { useStateStore } from '~/stores/state'
import dealPalette from '~/components/dealPalette.vue'
import container from '~/components/container.vue'
import { dealPaletteMode, itemPaletteMode } from '~/types/enums'
import type Deal from '~/types/deal'
import type ItemPublic from '~/types/itemPublic'
import card from '~/components/card.vue'

const store = useStateStore()

const itemDeals: Ref<{ item: ItemPublic; deals: Deal[] }[]> = ref([])

function listify(bDeals: Deal[]) {
  bDeals.forEach((valued) => {
    const t = itemDeals.value.findIndex(
      value => value.item.id === valued.item.id,
    )
    if (t === -1)
      itemDeals.value.push({ item: valued.item, deals: [valued] })

    else
      itemDeals.value[t].deals.push(valued)
  })
}

listify(store.getUser().buyDeals!)
</script>

<template>
  <div id="home" class="mx-auto mb-3 text-left container">
    <div class="my-2 inline-flex">
      <h1 class="mb-1 flex items-center justify-center font-bold">
        <span class="i-fluent:handshake-24-regular" /> &nbsp; Сделки на покупку
      </h1>
      &nbsp; &nbsp; &nbsp;
      <button
        class="h-9 border-b-4 border-red-700 rounded bg-red-500 px-4 py-2 font-bold text-white hover:border-red-500 hover:bg-red-400"
        @click="store.scanDeals()"
      >
        Обновить перечень
      </button>
    </div>

    <container
      v-for="itemDeal in itemDeals"
      :key="itemDeal.item.id"
      class="m-2 w-full rounded bg-red-700 p-1 text-left shadow"
    >
      <card :item="itemDeal.item" :mode="itemPaletteMode.inDeal" />
      <dealPalette
        v-for="deal in itemDeal.deals"
        :key="deal.id.toString"
        :deal="deal"
        :item="itemDeal.item"
        :mode="dealPaletteMode.buyDeal"
      />
    </container>
    <p v-if="itemDeals.length < 1">
      Список сделок покупки пуст
    </p>
  </div>
</template>

<style scoped>
.wrapper {
  display: flex;
  overflow-x: auto;
  padding: 3%;
}

.block-image {
  width: 200px;
  height: 200px;
  object-fit: cover;
}
</style>
