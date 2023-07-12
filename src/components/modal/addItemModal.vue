<script setup lang="ts">
import type { Ref } from 'vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { useStateStore } from '~/stores/state'
import ItemPrivate from '~/types/itemPrivate'

const emit = defineEmits<{
  (event: 'closed'): void
}>()

const { t, locale } = useI18n()

const newItem: Ref<ItemPrivate> = ref(
  new ItemPrivate('', [], 0, 0, '', '', '', []),
)

const store = useStateStore()
const tags = ref(store.getItems().tagList)
let uploadedImage: File | null
const message = ref('')
const added = ref(true)

function postItem() {
  const check = newItem.value.notEmpty()
  if (check.correct || uploadedImage) {
    store.addItem(newItem.value, uploadedImage!).then(() => {
      added.value = true
    })
  }
  else {
    message.value += check.message
    if (!uploadedImage)
      message.value += `${t('addModal.img')} `

    message.value += `${t('addModal.inc')} `
  }
}
</script>

<template>
  <div v-if="added">
    <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">
      {{t('addModal.postNew')}}
    </h3>
    <form class="space-y-6" @submit.prevent="postItem">
      <div>
        <uploadImage :heading="t('addModal.image')" @uploaded="(image: any) => { uploadedImage = image }" />
      </div>
      <div>
        <label
          for="name"
          class="mb-2 block text-sm font-light text-gray-900 dark:text-white"
        >{{t('addModal.name')}}</label>
        <input
          id="name"
          v-model="newItem.name"
          type="text"
          name="name"
          class="block w-full border border-gray-300 rounded-lg bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-500 focus:border-red-500 dark:bg-gray-600 dark:text-white focus:ring-red-500 dark:placeholder-gray-400"
          :placeholder="t('addModal.fif')"
        >
      </div><div class="flex">
        <div class="block">
          <div>
            <label
              for="description"
              class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >{{t('addModal.desc')}}</label>
            <textarea
              id="description"
              v-model.trim="newItem.description"
              class="text-grey-darker border-grey mb-1 block w-full appearance-none border rounded bg-white px-2 py-1 text-base leading-normal"
              name="description"
              :placeholder="t('addModal.changeDesc')"
            />
          </div>
          <div>
            <label
              for="tag"
              class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >{{t('addModal.tags')}}</label>
            <small
              for="tag"
              class="mb-2 block font-light text-gray-500 dark:text-white"
            >{{t('addModal.ifTags')}}</small>
            <select
              id="tag"
              v-model="newItem.tag"
              multiple
              class="border-2 border-dark"
            >
              <option disabled selected>
                {{t('addModal.chooseTags')}}
              </option>
              <option v-for="tag in tags" :key="tag.id" :value="tag.id">
                {{ tag.name }}
              </option>
            </select>
          </div><div>
            <label
              for="price"
              class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >{{ t('addModal.price') }}</label>
            <input
              id="price"
              v-model="newItem.price"
              min="1"
              type="number"
              name="price"
              class="block w-full border border-gray-300 rounded-lg bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-500 focus:border-red-500 dark:bg-gray-600 dark:text-white focus:ring-red-500 dark:placeholder-gray-400"
              placeholder="1"
            >
          </div>
          <div>
            <label
              for="availability"
              class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >{{ t('addModal.num') }}</label>
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
            >{{t('addModal.prod')}}</label>
            <small
              for="producer"
              class="mb-2 block font-medium text-gray-500 dark:text-white"
            >{{t('addModal.disclaimer')}}</small>
            <input
              id="producer"
              v-model="newItem.producer"
              type="text"
              name="producer"
              class="block w-full border border-gray-300 rounded-lg bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-500 focus:border-red-500 dark:bg-gray-600 dark:text-white focus:ring-red-500 dark:placeholder-gray-400"
              :placeholder="t('addModal.source')"
            >
          </div>
          <div>
            <p class="card-text text-muted">
              {{t('addModal.place')}}
              <input
                type="text"
                class="block w-50 w-full border border-gray-300 rounded-lg bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-500 focus:border-red-500 dark:bg-gray-600 dark:text-white focus:ring-red-500 dark:placeholder-gray-400"
                :placeholder="newItem.defaultPlace"
              >
              {{t('addModal.schedule')}}
              <VueDatePicker
                v-model="newItem.schedule"
                :min-date="new Date()"
                multi-dates
                :locale="locale"
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
        {{t('addModal.postNew')}}
      </button>
    </form>
  </div>
  <div v-else>
    <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">
      {{t('addModal.sucPosted')}}
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
