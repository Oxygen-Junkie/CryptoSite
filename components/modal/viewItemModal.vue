<script setup lang="ts">
import modal from './modal.vue'
import { bDealAction, dealState, reputation } from '~/types/enums'
import { useStateStore } from '~~/store/state'
import ItemPublic from '~~/types/itemPublic'

const props = defineProps<{
  item: ItemPublic
}>()
const purchased = ref(false)
const store = useStateStore()
const color = ref('currentColor')
const rep = ref('Никакой')
const amount = ref(1)
let buyerSchedule: Ref<Date[]>

function buy() {
  if (amount.value > 0) {
    store
      .bDealActions(
        bDealAction.Start,
        props.item,
        amount.value,
        '',
        '',
        buyerSchedule.value
      )
      .then(() => {
        purchased.value = true
      })
  }
}

switch (props.item.sellerReputation) {
  case reputation.OneDeal: {
    color.value = '#fbff00'
    rep.value = 'Приемлемой'
    break
  }
  case reputation.FewDeals: {
    color.value = '#ceff48'
    rep.value = 'Хорошей'
    break
  }
  case reputation.Established: {
    color.value = '#2bff00'
    rep.value = 'Отличной'
    break
  }
  default: {
    color.value = 'currentColor'
    rep.value = 'Начальной'
    break
  }
}
</script>

<template>
  <modal>
    <div v-if="purchased">
      <nuxt-img
        :src="`https://ipfs.io/ipfs/${props.item.imageCID}`"
        class="rounded mx-auto product-img"
      />
      <div>
        <label
          ><strong
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >Наименование:</strong
          ></label
        >
        <br />
        <span>
          {{ props.item.name }}
        </span>
      </div>
      <div style="display: flex">
        <span
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          style="width: 150px"
        >
          {{ props.item.description }}
        </span>

        <div class="text-left" style="width: 150px">
          <div>
            <span
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >Продавец обладает &nbsp;<strong style="color: currentColor">{{
                rep
              }}</strong
              >&nbsp; репутацией</span
            >
          </div>
          <div>
            <label
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >Выберите временные метки, когда вам удобно забрать товар:</label
            >
            <VueDatePicker
              v-model="buyerSchedule"
              :min-date="new Date()"
              multi-dates
              locale="ru"
              :allowed-dates="props.item.schedule"
            />
          </div>
          <div>
            <small
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >Производитель / Импортер / Или иной гарант качества
              предмета:</small
            ><small>
              {{ ` ${props.item.producer}` }}
            </small>
          </div>
        </div>
      </div>
      <div>
        <label><strong>Введите требуемое вам количество товара:</strong></label
        ><br />
        <input
          v-model="amount"
          type="number"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
          :max="props.item.availability"
          min="1"
        />
        <p class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          {{ `${amount}шт по ${props.item.price}руб ` }}
        </p>
        <strong
          v-show="amount > 1"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >{{ `СТОИМОСТЬЮ: ${amount * props.item.price!}руб` }}</strong
        >
      </div>

      <button
        class="w-full text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
        @click="buy"
      >
        <p i-carbon-delivery />
        &nbsp; Купить
      </button>
    </div>
    <div v-else>
      <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">
        Сделка на приобретение товара начата. Перейдите в раздел «Сделки» чтобы
        ознакомиться с ей.
      </h3>
      <button
        type="submit"
        class="w-full text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
      >
        Ок
      </button>
    </div>
  </modal>
</template>
