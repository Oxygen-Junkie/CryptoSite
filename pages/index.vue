<!-- eslint-disable prettier/prettier -->
<script setup lang="ts">
import ItemPublic from '~~/types/itemPublic'
import Tag from '~~/types/tag'
import { useStateStore } from '~~/store/state'
import Container from '~~/components/container.vue'
import { itemPaletteMode, reputation } from '~~/types/enums'
import PagingLine from '~~/components/pagingLine.vue'
import viewItemModal from '~~/components/modal/viewItemModal.vue'
import Card from '~~/components/card.vue'

const pagingIndex = ref(1)

definePageMeta({
  layout: 'default',
})

const itemsOnPage: Ref<
  {
    items: ItemPublic[]
  }[]
> = ref([])

const state = useStateStore()
const content: Ref<{
  itemList: ItemPublic[]
  tagList: Tag[]
}> =  ref(state.getItems())

divideOnPages(content.value.itemList)

function divideOnPages(content: ItemPublic[]) {
  if (content.length > 12) {
    let i = 0
    content.forEach((element, index) => {
      if ((index + 1) % 12) i += 1
      itemsOnPage.value?.[i].items.push(element)
    })
  }
}

function filterByTag(tag: Tag) {
  divideOnPages(
    tag.items as ItemPublic[])
}
</script>

<template>
  <div id="home" class="container mx-auto mb-3">
    <nuxt-img
      src="https://source.unsplash.com/800x300/?Japan"
      class="w-100"
      loading="lazy"
    />
    <Container>
      <div class="loaded">
        <div class="row">
          <div class="col-md p-5">
            <h1>Здравствуйте! 👋</h1>
            <p>С чем вы хотели бы ознакомиться сегодня?</p>
            <input placeholder="Имеет в названии...." />
          </div>
          <div class="col-md">
            <lottie-player
              src="https://assets7.lottiefiles.com/packages/lf20_3vbOcw.json"
              background="transparent"
              speed="1"
              style="width: 300px; height: 300px"
              loop
              autoplay
            />
          </div>
        </div>
      </div>
    </Container>
    <!-- <div class="row">
      <div v-if="'gfgf' !== 'Visitante'" class="col-md">
        <router-link to="/profile" class="text-decoration-none text-black">
          <Container class="text-center p-5">
            <h2><ion-icon name="cube-outline" /> Pedidos</h2>
            <img
              src="https://www.pngall.com/wp-content/uploads/5/Cardboard-Box-PNG-Image.png"
              alt="Caixa de pedidos"
              class="block-image"
            >
          </Container>
        </router-link>
      </div>
    </div> -->
    <Container>
      <h1><ion-icon name="apps-outline" /> Тэги</h1>
      <div class="loaded">
        <div class="row">
          <div class="wrapper">
            <div v-for="tag in content.tagList" :key="tag.id" class="col">
              <Block :tag="tag" @click="filterByTag(tag)" />
            </div>
          </div>
        </div>
      </div>
    </Container>
    <Container>
      <div class="inline-flex">
        <h1>
          <ion-icon name="balloon-outline" /> Товары ({{
            content.itemList.length
          }})
        </h1>
        <button
          type="button"
          class="btn rounded btn-green w-50"
          @click="state.updateItemList()"
        >
          Обновить перечень
        </button>
      </div>

      <div>
        <div class="row">
          <div
            v-for="product in itemsOnPage[pagingIndex].items"
            :key="product.id"
            class="col-md-3"
          >
            <Card
              v-show="
                product.sellerReputation !== reputation.BadActor ||
                !product.hidden
              "
              data-modal-target="viewItem-modal"
              data-modal-toggle="viewItem-modal"
              :item="product"
              :mode="itemPaletteMode.inGeneral"
            />
            <viewItemModal
              id="viewItem-modal"
              tabindex="-1"
              :item="product"
              aria-hidden="true"
              class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
            />
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
        <p v-if="content.itemList.length < 1">Список доступных товаров пуст</p>
      </div>
    </Container>
  </div>
</template>
