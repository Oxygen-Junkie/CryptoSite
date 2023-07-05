<script setup lang="ts">
import type { Ref } from 'vue'
import type ItemPublic from '~/types/itemPublic'
import type Tag from '~/types/tag'
import { useStateStore } from '~/stores/state'
import Container from '~/components/container.vue'
import { itemPaletteMode, modals, reputation } from '~/types/enums'
import PagingLine from '~/components/pagingLine.vue'
import Card from '~/components/card.vue'
import { useFlagStore } from '~/stores/flags'

const pagingIndex = ref(0)
const flags = useFlagStore()

const itemsOnPage: Ref<
  {
    items: ItemPublic[]
  }[]
> = ref([])

const state = useStateStore()
const content: Ref<{
  itemList: ItemPublic[]
  tagList: Tag[]
}> = ref(state.getItems())

const tags = ref(content.value.tagList)

divideOnPages(state.getItems().itemList)

function divideOnPages(content: ItemPublic[]) {
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

function filterByTag(tag: Tag) {
  divideOnPages(tag.items as ItemPublic[])
}

function searchUp(query: string) {
  if (query !== '') {
    divideOnPages(
      content.value.itemList.filter(value => value.name?.includes(query)),
    )
    tags.value = content.value.tagList.filter(value =>
      value.name?.includes(query),
    )
  }
  else {
    searchDown()
  }
}

function searchDown() {
  divideOnPages(content.value.itemList)
  tags.value = content.value.tagList
}
</script>

<template>
  <div id="home" class="mx-auto mb-3 container">
    <img
      src="https://source.unsplash.com/800x300/?Japan"
      class="w-full"
      alt=""
    >
    <Container>
      <div class="loaded">
        <h1>Здравствуйте! 👋</h1>
        <p>С чем вы хотели бы ознакомиться сегодня?</p>
        <search @filter="searchUp" @cancel="searchDown" />
      </div>
    </Container>
    <Container>
      <div class="inline-flex">
        <h1 class="mb-1 flex items-center justify-center font-bold">
          <span class="i-fa6-regular-bookmark" /> &nbsp; Тэги
        </h1>
      </div>
      <div class="flex overflow-x-scroll pb-10">
        <div class="ml-10 flex flex-nowrap lg:ml-40 md:ml-20">
          <button
            v-for="tag in tags"
            :key="tag.id"
            :tag="tag"
            @click="
              () => {
                filterByTag(tag)
              }
            "
          >
            <Block :tag="tag" />
          </button>
        </div>
      </div>
    </Container>
    <Container>
      <div class="mb-1 inline-flex">
        <h1 class="m-1 flex items-center justify-center font-bold">
          <span class="i-charm-candy" /> &nbsp; Товары ({{ content.itemList.length }})
        </h1>
        &nbsp; &nbsp; &nbsp;
        <button
          class="h-9 border-b-4 border-red-700 rounded bg-red-500 px-4 py-2 font-bold text-white hover:border-red-500 hover:bg-red-400"
          @click="state.updateItemList()"
        >
          Обновить перечень
        </button>
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
                  flags.openModal(modals.viewItemModal, product)
                }
              "
            >
              <Card
                v-show="
                  product.sellerReputation !== reputation.BadActor
                    || !product.hidden
                "
                :item="product"
                :mode="itemPaletteMode.inGeneral"
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
        <p v-if="content.itemList.length < 1">
          Список доступных товаров пуст
        </p>
      </div>
    </Container>
  </div>
</template>
