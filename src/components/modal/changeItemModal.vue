<script setup lang="ts">
import type { Ref } from 'vue'
import '@vuepic/vue-datepicker/dist/main.css'
import { useStateStore } from '~/stores/state'
import type ItemPrivate from '~/types/itemPrivate'
import uploadImage from '../uploadImage.vue'

const props = defineProps<{
  oldItem: ItemPrivate
}>()

const emit = defineEmits<{
  (event: 'closed'): void
}>()

const newItem: Ref<ItemPrivate> = ref(props.oldItem)
const store = useStateStore()
const tags = ref(store.getItems().tagList)
let uploadedImage: File | null
const message = ref('')
const added = ref(true)

function postItem() {
  const check = newItem.value.notEmpty()
  if (check.correct || uploadedImage) {
    store.changeItem(newItem.value, uploadedImage!).then(() => {
      added.value = true
    })
  }
  else {
    message.value += check.message
    if (!uploadedImage)
      message.value += '"Изображение товара" '

    message.value += 'неправильно заданы'
  }
}
</script>

<template>
  <div v-if="added">
    <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">
      Измените добавленный ранее товар
    </h3>
    <form class="space-y-6" @submit.prevent="postItem">
      <div>
        <uploadImage heading="Новое изображение товара" @uploaded="(image) => { uploadedImage = image }" />
        <img
          :src="`https://ipfs.io/ipfs/${newItem.imageCID}`"
          class="product-img mx-auto rounded"
        >
      </div>
      <div>
        <label
          for="name"
          class="mb-2 block text-sm font-light text-gray-900 dark:text-white"
        >Новое название</label>
        <input
          id="name"
          v-model="newItem.name"
          type="text"
          name="name"
          class="block w-full border border-gray-300 rounded-lg bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-500 focus:border-red-500 dark:bg-gray-600 dark:text-white focus:ring-red-500 dark:placeholder-gray-400"
          placeholder="До 50 символов"
        >
      </div><div class="flex">
        <div class="block">
          <div>
            <label
              for="description"
              class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >Новое описание</label>
            <textarea
              id="description"
              v-model.trim="newItem.description"
              class="text-grey-darker border-grey mb-1 block w-full appearance-none border rounded bg-white px-2 py-1 text-base leading-normal"
              name="description"
              placeholder="Введите описание товара"
            />
          </div>
          <div>
            <label
              for="tag"
              class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >Новые тэги предмета</label>
            <select
              id="tag"
              v-model="newItem.tag"
              multiple
              class="border-2 border-dark"
            >
              <option disabled selected>
                Выберете подходящие тэги
              </option>
              <option v-for="tag in tags" :key="tag.id" :value="tag.id">
                {{ tag.name }}
              </option>
            </select>
          </div><div>
            <label
              for="price"
              class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >Новая цена за один предмет</label>
            <input
              id="price"
              v-model="newItem.price"
              min="1"
              type="number"
              name="price"
              class="block w-full border border-gray-300 rounded-lg bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-500 focus:border-red-500 dark:bg-gray-600 dark:text-white focus:ring-red-500 dark:placeholder-gray-400"
              placeholder="0"
            >
          </div>
          <div>
            <label
              for="availability"
              class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >Новое количество предметов на продажу</label>
            <input
              id="availability"
              v-model="newItem.availability"
              min="1"
              type="number"
              name="availability"
              class="block w-full border border-gray-300 rounded-lg bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-500 focus:border-red-500 dark:bg-gray-600 dark:text-white focus:ring-red-500 dark:placeholder-gray-400"
              placeholder="0"
            >
          </div>
        </div><div class="pl-4 text-left">
          <div>
            <label
              for="producer"
              class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >Новый гарант качества предмета</label>
            <input
              id="producer"
              v-model="newItem.producer"
              type="text"
              name="producer"
              class="block w-full border border-gray-300 rounded-lg bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-500 focus:border-red-500 dark:bg-gray-600 dark:text-white focus:ring-red-500 dark:placeholder-gray-400"
              placeholder="Источник"
            >
          </div>
          <div>
            <p class="card-text text-muted">
              Новое место совершения сделки
              <input
                type="text"
                class="block w-50 w-full border border-gray-300 rounded-lg bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-500 focus:border-red-500 dark:bg-gray-600 dark:text-white focus:ring-red-500 dark:placeholder-gray-400"
                :placeholder="newItem.defaultPlace"
              >
              Новый график совершения сделки
              <VueDatePicker
                v-model="newItem.schedule"
                :min-date="new Date()"
                multi-dates
                locale="ru"
              />
            </p>
          </div>
        </div>
      </div>
      <div
        v-if="message"
        class="text-red-darker border-red-dark bg-red-lighter relative mb-4 border rounded px-3 py-3"
      >
        {{ message }}
      </div>

      <button
        type="submit"
        class="w-full rounded-lg bg-red-700 px-5 py-2.5 text-center text-sm font-medium text-white dark:bg-red-600 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:hover:bg-red-700 dark:focus:ring-red-800"
      >
        Изменить
      </button>
      <button
        class="w-full rounded-lg bg-purple-700 px-5 py-2.5 text-center text-sm font-medium text-white dark:bg-purple-600 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 dark:hover:bg-purple-700 dark:focus:ring-purple-800"
      >
        Удалить
      </button>
    </form>
  </div>
  <div v-else>
    <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">
      Товар успешно изменен
    </h3>
    <button
      type="submit"
      class="w-full rounded-lg bg-red-700 px-5 py-2.5 text-center text-sm font-medium text-white dark:bg-red-600 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:hover:bg-red-700 dark:focus:ring-red-800"
      @click="emit('closed')"
    >
      Ок
    </button>
  </div>
</template>
