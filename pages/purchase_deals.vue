<script setup lang="ts">
import { useStateStore } from '~~/store/state'
import dealPalette from '~~/components/dealPalette.vue'
import container from '~~/components/container.vue'
import { dealPaletteMode, itemPaletteMode } from '~~/types/enums'
import Deal from '~~/types/deal'
import ItemPublic from '~~/types/itemPublic'
import card from '~~/components/card.vue'

const store = useStateStore()
if (store.isUserLogged) navigateTo('/')

const itemDeals: Ref<{ item: ItemPublic; deals: Deal[] }[]> = ref([])

store.user.buyDeals?.forEach((valued) => {
  const t = itemDeals.value?.findIndex((value) => value.item === valued.item)
  if (t) {
    itemDeals.value![t].item = valued.item
    itemDeals.value![t].deals.push(valued)
  } else {
    itemDeals.value!.push({ item: valued.item, deals: [valued] })
  }
})
</script>

<template>
  <div id="home" class="container mx-auto mb-3"></div>
  <h1><ion-icon name="download-outline" /> Сделки на покупку</h1>

  <container
    v-for="itemDeal in itemDeals"
    :key="itemDeal.item.id"
    class="bg-red shadow p-1 mt-1 rounded w-100"
  >
    <div class="row">
      <div class="col-md-3">
        <card :item="itemDeal.item" :mode="itemPaletteMode.inDeal" />
      </div>
    </div>
    <dealPalette
      v-for="deal in itemDeal.deals"
      :key="deal.id.toString"
      :deal="deal"
      :item="itemDeal.item"
      :mode="dealPaletteMode.buyDeal"
    />
  </container>
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

.bg-red {
  background-color: red;
}
</style>
