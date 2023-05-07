<script setup lang="ts">
import PictureInput from 'vue-picture-input'
import { useStateStore } from '~~/store/state'
import ItemPrivate from '~~/types/itemPrivate'

const newItem: Ref<ItemPrivate> = ref(new ItemPrivate('', [], 0, 0, '', ''))
const store = useStateStore()
const tags = ref(store.getItems().tagList)
let uploadedImage: {} | null
const message = ref('')

function postItem() {
  const check = newItem.value.notEmpty()
  if (check.correct || uploadedImage) {
    store.addItem(newItem.value, uploadedImage)
  } else {
    message.value += check.message
    if (!uploadedImage) {
      message.value += '"Изображение товара" '
    }
    message.value += 'неправильно заданы'
  }
}

function onChange(image: {}) {
  if (image) {
    uploadedImage = image
  }
}
</script>

<template>
  <modal>
    
  </modal>
  <modal>
    <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">
      Sign in to our platform
    </h3>
    <form class="space-y-6" @submit.prevent="postItem">
      <div>
        <label
          for="email"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >Изображение товара</label
        >
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
      </div>
      <div>
        <label
          for="name"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >Название</label
        >
        <input
          id="name"
          v-model="newItem.name"
          type="text"
          name="name"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
          placeholder="До 50 символов"
          required
        />
      </div>
      <div>
        <label
          for="description"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >Описание</label
        >
        <textarea
          id="description"
          v-model.trim="newItem.description"
          class="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-grey-darker border border-grey rounded"
          required
          name="description"
          placeholder="Введите описание товара"
        />
      </div>
      <div>
        <label
          for="tag"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >Тэги предмета</label
        >
        <small
          for="tag"
          class="block mb-2 font-medium text-gray-500 dark:text-white"
          >Если подходящего тэга нет, значит предмет запрещён к продаже</small
        >
        <select
          id="tag"
          v-model="newItem.tag"
          multiple
          class="border-2 border-dark"
        >
          <option disabled selected>Выберете подходящие тэги</option>
          <option v-for="tag in tags" :key="tag.id" :value="tag.id">
            {{ tag.name }}
          </option>
        </select>
      </div>
      <div>
        <label
          for="price"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >Цена за один предмет</label
        >
        <input
          id="price"
          v-model="newItem.price"
          min="1"
          type="number"
          name="price"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
          placeholder="0"
          required
        />
      </div>
      <div>
        <label
          for="availability"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >Количество предметов на продажу</label
        >
        <input
          id="availability"
          v-model="newItem.availability"
          min="1"
          type="number"
          name="availability"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
          placeholder="0"
          required
        />
      </div>
      <div>
        <label
          for="producer"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >Производитель / Импортер / Или иной гарант качества предмета</label
        >
        <small
          for="producer"
          class="block mb-2 font-medium text-gray-500 dark:text-white"
          >Предметы запрещенные к обороту в РФ запрещены на этом сайте</small
        >
        <input
          id="producer"
          v-model="newItem.producer"
          type="text"
          name="producer"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
          placeholder="Источник"
          required
        />
      </div>
      <button
        type="submit"
        class="w-full text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
      >
        Разместить
      </button>
    </form>
  </modal>
</template>
