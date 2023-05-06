<script setup lang="ts">
import { useStateStore } from '~~/store/state'
import Deal from '~~/types/deal'
import { dealPaletteMode, itemPaletteMode } from '~~/types/enums'
import ItemPrivate from '~~/types/itemPrivate'
import PagingLine from '~~/components/pagingLine.vue'
import addItemModal from '~/components/modal/addItemModal.vue'
import itemPublic from '~~/types/itemPublic'

const store = useStateStore()

const pagingIndex = ref(1)
const itemDeals: Ref<{ item: itemPublic; deals: Deal[] }[]> = ref([])

store.user.sellDeals?.forEach((valued) => {
  const t = itemDeals.value?.findIndex((value) => value.item === valued.item)
  if (t) {
    itemDeals.value![t].item = valued.item
    itemDeals.value![t].deals.push(valued)
  } else {
    itemDeals.value!.push({ item: valued.item, deals: [valued] })
  }
})

function postNewItem() {}

const itemsOnPage: Ref<
  {
    items: ItemPrivate[]
  }[]
> = ref([])

function divideOnPages() {
  if (store.user.postedItems && store.user.postedItems.length > 12) {
    let i = 0
    store.user.postedItems.forEach((element, index) => {
      if ((index + 1) % 12) i += 1
      itemsOnPage.value?.[i].items.push(element)
    })
  }
}

divideOnPages()
</script>

<template>
  <div v-if="itemDeals">
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
  </div>

  <container>
    <h1>
      <ion-icon name="document-attach-outline" /> Установить новое объявление о
      продаже товара
    </h1>
    <button
      type="button"
      class="btn rounded btn-primary m-3 p-3 w-100"
      data-modal-target="viewItem-modal"
      data-modal-toggle="viewItem-modal"
    >
      + Разместить новый товар
    </button>
  </container>

  <container v-if="store.user.postedItems">
    <h1>
      <ion-icon name="balloon-outline" /> Выставленные вами товары ({{
        store.user.postedItems.length
      }})
    </h1>

    <div class="row">
      <div
        v-for="product in itemsOnPage[pagingIndex].items"
        :key="product.id"
        class="col-md-3"
      >
        <Card :item="product" :mode="itemPaletteMode.inPosted" />
      </div>
    </div>
    <PagingLine
      :paging-index="pagingIndex"
      :items-on-page="itemsOnPage"
      @change-page-by="
        (pagingIndexDif) => {
          pagingIndex += pagingIndexDif
        }
      "
      @change-page-to="
        (pagingIndexEq) => {
          pagingIndex = pagingIndexEq
        }
      "
    />
  </container>
  <addItemModal
    id="addItem-modal"
    tabindex="-1"
    aria-hidden="true"
    class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
  />
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
