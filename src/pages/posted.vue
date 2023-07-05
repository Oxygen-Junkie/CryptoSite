<script setup lang="ts">
import type { Ref } from 'vue'
import { useStateStore } from '~/stores/state'
import type Deal from '~/types/deal'
import { dealPaletteMode, itemPaletteMode, modals } from '~/types/enums'
import type ItemPrivate from '~/types/itemPrivate'
import type ItemPublic from '~/types/itemPublic'
import PagingLine from '~/components/pagingLine.vue'
import Card from '~/components/card.vue'
import container from '~/components/container.vue'
import { useFlagStore } from '~/stores/flags'

const { t } = useI18n()

const store = useStateStore()
const flags = useFlagStore()

const pagingIndex = ref(0)
const itemDeals: Ref<{ item: ItemPublic; deals: Deal[] }[]> = ref([])
const itemsOnPage: Ref<
  {
    items: ItemPrivate[]
  }[]
> = ref([])

function listify(sDeals: Deal[]) {
  sDeals.forEach((valued) => {
    const t = itemDeals.value.findIndex(
      value => value.item.id === valued.item.id,
    )
    if (t === -1) {
      itemDeals.value.push({
        item: valued.item,
        deals: [valued],
      })
    }
    else {
      itemDeals.value[t].deals.push(valued)
    }
  })
}

listify(store.getUser().sellDeals!)
const сo: Ref<ItemPrivate[]> = ref(store.getUser().postedItems!)
divideOnPages(сo.value)

function divideOnPages(content: ItemPrivate[]) {
  let i = 0
  itemsOnPage.value = []
  content.forEach((element, index) => {
    i = Math.floor(index / 12)
    const t = itemsOnPage.value?.[i]
    if (t)
      t.items.push(element)

    else
      itemsOnPage.value.push({ items: [element] })
  })
}
</script>

<template>
  <div id="home" class="mx-auto mb-3 text-left container">
    <div class="my-2 inline-flex">
      <h1 class="mb-1 flex items-center justify-center font-bold">
        <span class="i-gg-credit-card" /> &nbsp; {{ t('Purchase_Deals') }}
      </h1>
      &nbsp; &nbsp; &nbsp;
      <button
        class="h-9 border-b-4 border-red-700 rounded bg-red-500 px-4 py-2 font-bold text-white hover:border-red-500 hover:bg-red-400"
        @click="store.scanDeals()"
      >
        {{ t('Refresh') }}
      </button>
    </div>

    <container
      v-for="itemDeal in itemDeals"
      :key="itemDeal.item.id"
      class="m-2 w-full rounded bg-red-700 p-1 text-left shadow"
    >
      <Card :item="itemDeal.item" :mode="itemPaletteMode.inDeal" />
      <dealPalette
        v-for="deal in itemDeal.deals"
        :key="deal.id.toString"
        :deal="deal"
        :item="itemDeal.item"
        :mode="dealPaletteMode.sellDeal"
      />
    </container>
    <p v-if="itemDeals.length < 1">
      Список сделок покупки пуст
    </p>
  </div>

  <container>
    <div class="mb-1 inline-flex">
      <h1 class="mb-1 flex items-center justify-center font-bold">
        <span class="i-gg-add-r" /> &nbsp; {{ t('Post_New') }}
      </h1>
    </div>
    &nbsp;
    <button
      type="button"
      class="h-9 border-b-4 border-red-700 rounded bg-red-500 px-4 py-2 font-bold text-white hover:border-red-500 hover:bg-red-400"
      @click="
        () => {
          flags.openModal(modals.addItemModal)
        }
      "
    >
      + {{ t('Post_New') }}
    </button>
  </container>
  <container>
    <div class="mb-1 inline-flex">
      <h1 class="mb-1 flex items-center justify-center font-bold">
        <span class="i-gg-clipboard" /> &nbsp; {{ t('Posted_Items') }} ({{ сo.length }})
      </h1>
    </div>

    <div>
      <div class="grid grid-cols-4 gap-y-2">
        <div
          v-for="product in itemsOnPage[pagingIndex].items"
          :key="product.id"
        >
          <button
            @click="
              () => {
                flags.openModal(modals.changeItemModal, product)
              }
            "
          >
            <Card
              :item="product"
              :mode="itemPaletteMode.inPosted"
              class="p-10"
            />
          </button>
        </div>
      </div>
      <PagingLine
        v-if="itemsOnPage.length > 1"
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
      <p v-if="itemsOnPage[0].items.length < 1">
        Список выставленных товаров пуст
      </p>
    </div>
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
