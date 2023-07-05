<script setup lang="ts">
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

const state = useStateStore()

const place = ref(props.deal.place)
const time = ref(props.deal.time)

function callOffDeal() {
  if (place.value === props.deal.place && time.value === props.deal.time) {
    state
      .sDealActions(sDealAction.CallOff, props.deal)
      .then(() => {
        emit('dealt', false)
      })
      .catch(() => {})
  }
  else {
    state
      .sDealActions(
        sDealAction.ChangeRendezvous,
        props.deal,
        place.value,
        time.value,
      )
      .then(() => {
        emit('dealt', false)
      })
      .catch(() => {})
  }
}
</script>

<template>
  <h4 class="inline-flex font-medium">
    <span class="i-octicon:code-of-conduct-24" />&nbsp;
    <span>{{
      `Продажа товара ${item.name} в
    количестве ${deal.amount} шт.`
    }}</span>
  </h4>
  <h6 class="font-bald text-red-700">
    Сделка согласована. Чтобы получить оплату покупателю необходимо сообщить код
    оплаты.
  </h6>
  Код оплаты: &nbsp;<span class="text-red">
    {{ `${state.getPayCode(deal.id)}` }}
  </span>
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
  <small class="font-thin">НЕОБЯЗАТЕЛЬНО. При отзывании сделки вы можете изменить место и время ёё
    проведения, если хотите чтобы она состоялась поже
  </small>
  <p class="mb-1 font-medium">
    Место
  </p>
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
    class="w-50"
    locale="ru"
    :allowed-dates="props.deal.schedule"
  />
  <button
    type="button"
    class="h-9 border-b-4 border-red-700 rounded bg-red-500 px-4 py-2 font-bold text-white hover:border-red-500 hover:bg-red-400"
    @click="callOffDeal()"
  >
    Отозвать сделку
  </button>
</template>
