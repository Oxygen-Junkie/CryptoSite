<script setup lang="ts">
import { useUserStateStore } from '../store/ustate'
import ItemLimited from '../types/itemLimited'
import Tag from '../types/tag'

const pagingIndex = ref(1)
const itemsOnPage: Ref<{
  items: ItemLimited[]
}[]> = ref([])
let content: Ref<{
  itemList: ItemLimited[]
  tagList: Tag[]
}>
const userState = useUserStateStore()
userState.connectWallet().then(() => {
  content.value = userState.getItems()
  divideOnPages(content.value.itemList)
})

function divideOnPages(content: ItemLimited[]) {
  if (content.length > 12) {
    let i = 0
    content.forEach((element, index) => {
      if ((index + 1) % 12)
        i += 1
      itemsOnPage.value?.[i].items.push(element)
    })
  }
}

function filterByTag(id: number) {
  divideOnPages(content.value.itemList.filter(value => value.tagIds.includes(id)))
}
</script>

<template>
  <div id="home" class="container mx-auto mb-3">
    <img src="https://source.unsplash.com/800x300/?Japan" class="w-100">
    <Container>
      <div v-if="!userState.loadingUser" class="loading">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      <div v-show="userState.loadingUser" class="loaded">
        <div class="row">
          <div class="col-md p-5">
            <h1>Здравствуйте! 👋</h1>
            <p>С чем вы хотели бы ознакомиться сегодня?</p>
            <input placeholder="Имеет в названии....">
          </div>
          <div class="col-md">
            <lottie-player
              src="https://assets7.lottiefiles.com/packages/lf20_3vbOcw.json"
              background="transparent"
              speed="1"
              style="width = ref(300px; height = ref(300px"
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
      <h1><ion-icon name="apps-outline" /> Категории</h1>
      <div v-if="!userState.loadingItems" class="loading">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      <div v-show="userState.loadingItems" class="loaded">
        <div class="row">
          <div class="wrapper">
            <div v-for="tag in content.tagList" :key="tag.id" class="col">
              <Block
                :name="tag.name"
                @click="filterByTag(tag.id)"
              />
            </div>
          </div>
        </div>
      </div>
    </Container>
    <Container>
      <h1>
        <ion-icon name="balloon-outline" /> Товары ({{
          content.itemList.length
        }})
      </h1>
      <div v-if="!userState.loadingItems" class="loading">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      <div v-show="userState.loadingItems">
        <div class="row">
          <div v-for="product in itemsOnPage[pagingIndex].items" :key="product.id" class="col-md-3">
            <Card
              :id="product.id"
              :image="product.imageCID"
              :name="product.name"
              :price="product.price"
            />
          </div>
        </div>
        <nav v-if="itemsOnPage.length < 2" class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
          <a href="#" class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
            <span class="sr-only">Previous</span>
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
            </svg>
          </a>
          <!-- Current: "z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600", Default: "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0" -->
          <a v-if="pagingIndex > 2" href="#" aria-current="page" class="relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" @click="pagingIndex = 0">1</a>
          <a v-if="itemsOnPage[pagingIndex - 2]" href="#" class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0" @click="pagingIndex -= 2">{{ pagingIndex - 1 }}</a>
          <a v-if="itemsOnPage[pagingIndex - 1]" href="#" class="relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex" @click="pagingIndex -= 1">{{ pagingIndex }}</a>
          <span class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">...</span>
          // eslint-disable-next-line vue/no-parsing-error
          <a href="#" class="relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex">{{ pagingIndex + 1 }}</a>
          // eslint-disable-next-line vue/no-parsing-error
          <a href="#" class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0" @click="pagingIndex + 1">{{ pagingIndex + 2 }}</a>
          <a href="#" class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0" @click="pagingIndex = Number(itemsOnPage.lastIndexOf)">{{ Number(itemsOnPage?.lastIndexOf) + 1 }}</a>
          <a href="#" class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
            <span class="sr-only">Next</span>
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
            </svg>
          </a>
        </nav>
        <p v-if="content.itemList.length < 1">
          List of Items is empty
        </p>
      </div>
    </Container>
  </div>
</template>
