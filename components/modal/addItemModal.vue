<script setup lang="ts">
import PictureInput from 'vue-picture-input'
import { useStateStore } from '~~/store/state'
import ItemPrivate from '~~/types/itemPrivate'

const newItem: Ref<ItemPrivate> = ref(new ItemPrivate('', [], 0, 0, '', ''))
const store = useStateStore()
const tags = ref(store.getItems().tagList)
let uploadedImage: null

function postItem() {
  const check = newItem.value.notEmpty()
  if (check.correct || uploadedImage) {
    store.addItem(newItem.value)
  } else {
  }
}

function onChange(image: any) {
  if (image) {
    uploadedImage = image
  }
}
</script>

<template>
  <modal>
    <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">
      Sign in to our platform
    </h3>
    <form class="space-y-6" @submit.prevent="postItem">
      <picture-input
        ref="pictureInput"
        width="600"
        height="600"
        margin="16"
        accept="image/jpeg,image/png"
        size="10"
        button-class="btn"
        :custom-strings="{
          upload: '<h1>Загружено!</h1>',
          drag: 'Переместите сюда изображения товара',
        }"
        @change="onChange"
      >
      </picture-input>
      <div>
        <label
          for="email"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >Your email</label
        >
        <input
          id="email"
          type="email"
          name="email"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
          placeholder="name@company.com"
          required
        />
      </div>
      <div>
        <label
          for="password"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >Your password</label
        >
        <input
          id="password"
          type="password"
          name="password"
          placeholder="••••••••"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
          required
        />
      </div>
      <div class="flex justify-between">
        <div class="flex items-start">
          <div class="flex items-center h-5">
            <input
              id="remember"
              type="checkbox"
              value=""
              class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-red-300 dark:bg-gray-600 dark:border-gray-500 dark:focus:ring-red-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
              required
            />
          </div>
          <label
            for="remember"
            class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >Remember me</label
          >
        </div>
        <a
          href="#"
          class="text-sm text-red-700 hover:underline dark:text-red-500"
          >Lost Password?</a
        >
      </div>
      <button
        type="submit"
        class="w-full text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
      >
        Login to your account
      </button>
      <div class="text-sm font-medium text-gray-500 dark:text-gray-300">
        Not registered?
        <a href="#" class="text-red-700 hover:underline dark:text-red-500"
          >Create account</a
        >
      </div>
    </form>
  </modal>

  <div
    id="exampleModal"
    class="modal fade"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 id="exampleModalLabel" class="modal-title">
            Cadastrar novo produto
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>
        <div class="modal-body">
          <form id="form" @submit.prevent="SendData">
            <label for="name"
              ><ion-icon name="text-outline" /> Nome do produto</label
            >
            <input
              id="name"
              v-model="newItem.name"
              type="text"
              class="form-control"
              required
            />
            <br />
            <div class="row">
              <div class="col-md-8">
                <label for="image"
                  ><ion-icon name="image-outline" /> Imagem do produto</label
                >
                <input
                  id="image"
                  v-model="image"
                  type="text"
                  class="form-control"
                  required
                />
              </div>
              <div class="col-md-4">
                <img
                  :src="
                    image ||
                    'https://www.signfix.com.au/wp-content/uploads/2017/09/placeholder-600x400.png'
                  "
                  alt="Imagem"
                  class="image rounded"
                />
              </div>
            </div>
            <br />
            <label for="price"
              ><ion-icon name="pricetags-outline" /> Preço</label
            >
            <input
              id="price"
              v-model="price"
              type="number"
              min="0"
              step="0.01"
              class="form-control"
            />
            <br />
            <label for="tag"
              ><ion-icon name="pricetag-outline" /> Categoria do produto</label
            >
            <select id="tag" class="form-select" @change="selected($event)">
              <option v-for="tag in tags" :key="tag.id" :value="tag.id">
                {{ tag.name }}
              </option>
            </select>
            <br />
            <label
              ><ion-icon name="fast-food-outline" /> O produto é
              perecível?</label
            >
            <div class="form-check">
              <input
                id="opt1"
                v-model="perishable"
                type="radio"
                value="0"
                name="perishable"
                class="form-check-input"
              />
              <label for="opt1" class="form-check-label">Não</label>
              <br />
              <input
                id="opt2"
                v-model="perishable"
                type="radio"
                value="1"
                name="perishable"
                class="form-check-input"
              />
              <label for="opt2" class="form-check-label">Sim</label>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Fechar
          </button>
          <button
            type="submit"
            class="btn btn-success"
            data-bs-dismiss="modal"
            @click="SendForm"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
