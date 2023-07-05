<script setup lang="ts">
import type { Ref } from 'vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { useStateStore } from '~/stores/state'
import type Deal from '~/types/deal'
import { sDealAction } from '~/types/enums'
import type ItemPrivate from '~/types/itemPrivate'

const props = defineProps<{
  item: ItemPrivate
  deal: Deal
}>()

const emit = defineEmits<{
  (event: 'dealt', sync: boolean): void
}>()

const place = ref('')
const time: Ref<Date | undefined> = ref()
const message = ref('')

const state = useStateStore()

function confirmDeal() {
  if (time.value) {
    state
      .sDealActions(sDealAction.Confirm, props.deal, place.value, time.value)
      .then(() => {
        emit('dealt', false)
      })
      .catch(() => {})
  }
  else {
    message.value = 'Установите время сделки'
  }
}

function removeDeal() {
  state
    .sDealActions(sDealAction.Remove, props.deal)
    .then(() => {
      emit('dealt', true)
    })
    .catch(() => {})
}
</script>

<template>
  <h4 class="inline-flex font-medium">
    <span class="i-octicon-briefcase-16" />&nbsp;
    <span>{{
      `Продажа товара ${item.name} в
    количестве ${deal.amount} шт.`
    }}</span>
  </h4>
  <h6 class="font-bald text-red-700">
    Сделка ожидает подтверждения
  </h6>
  <p class="font-thin">
    {{
      `Стоимость заказа ${Number(
        props.item.price * parseInt(deal.amount.toString()),
      )} ₽ что эквивалентно ${Number(
        (props.item.price * parseInt(deal.amount.toString()) * 1000)
          / state.getCurrency().eth
          / state.getCurrency().rub,
      ).toFixed(2)} Mwei`
    }}
  </p>
  <small class="font-bald">Перед продажей проверьте </small>
  <p class="mb-1 font-medium">
    Место
  </p>
  &nbsp;
  <input
    v-model="place"
    type="text"
    class="w-50"
    :placeholder="props.deal.place"
  >
  <p class="mb-1 font-medium">
    Время
  </p>
  <VueDatePicker
    v-model="time"
    :min-date="new Date()"
    locale="ru"
    :allowed-dates="props.deal.schedule"
  />

  <div v-if="message" class="font-bald text-red-700">
    {{ message }}
  </div>

  <button
    type="button"
    class="h-9 border-b-4 border-red-700 rounded bg-red-500 px-4 py-2 font-bold text-white hover:border-red-500 hover:bg-red-400"
    @click="confirmDeal()"
  >
    Подтвердить сделку
  </button>
  <button
    type="button"
    class="h-9 border-b-4 border-yellow-700 rounded bg-yellow-500 px-4 py-2 font-bold text-white hover:border-yellow-500 hover:bg-yellow-400"
    @click="removeDeal()"
  >
    Удалить сделку
  </button>
</template>
