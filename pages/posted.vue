<script setup lang="ts">
import { useStateStore } from '~~/store/state'
import Deal from '~~/types/deal'
import { dealPaletteMode, itemPaletteMode } from '~~/types/enums'
import ItemPrivate from '~~/types/itemPrivate'

const store = useStateStore()
if (store.isUserLogged) navigateTo('/')

const pagingIndex = ref(1)
const itemDeals: Ref<{ item: ItemPrivate; deals: Deal[] }[]> = ref([])

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
  <container>
    <h1>
      <ion-icon name="document-attach-outline" /> Установить новое объявление о
      продаже товара
    </h1>
    <button
      type="button"
      class="btn rounded btn-primary m-3 p-3 w-100"
      @click="postNewItem"
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
        <Card :item="product" :mode="itemPaletteMode.inGeneral" />
      </div>
    </div>
    <nav
      v-if="itemsOnPage.length < 2"
      class="isolate inline-flex -space-x-px rounded-md shadow-sm"
      aria-label="Pagination"
    >
      <a
        href="#"
        class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
      >
        <span class="sr-only">Прошлая</span>
        <svg
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
            clip-rule="evenodd"
          />
        </svg>
      </a>
      <!-- Current: "z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600", Default: "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0" -->
      <a
        v-if="pagingIndex > 2"
        href="#"
        aria-current="page"
        class="relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        @click="pagingIndex = 0"
        >1</a
      >
      <a
        v-if="itemsOnPage[pagingIndex - 2]"
        href="#"
        class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
        @click="pagingIndex -= 2"
        >{{ pagingIndex - 1 }}</a
      >
      <a
        v-if="itemsOnPage[pagingIndex - 1]"
        href="#"
        class="relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex"
        @click="pagingIndex -= 1"
        >{{ pagingIndex }}</a
      >
      <span
        class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0"
        >...</span
      >
      // eslint-disable-next-line vue/no-parsing-error
      <a
        href="#"
        class="relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex"
        >{{ pagingIndex + 1 }}</a
      >
      // eslint-disable-next-line vue/no-parsing-error
      <a
        href="#"
        class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
        @click="pagingIndex + 1"
        >{{ pagingIndex + 2 }}</a
      >
      <a
        href="#"
        class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
        @click="pagingIndex = Number(itemsOnPage.lastIndexOf)"
        >{{ Number(itemsOnPage?.lastIndexOf) + 1 }}</a
      >
      <a
        href="#"
        class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
      >
        <span class="sr-only">Следующая</span>
        <svg
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
            clip-rule="evenodd"
          />
        </svg>
      </a>
    </nav>
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
