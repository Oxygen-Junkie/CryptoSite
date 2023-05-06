<script setup lang="ts">
import { useStateStore } from '~/store/state'
import type Deal from '~/types/deal'
import { sDealAction, dealState } from '~/types/enums'
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
      .then((dealState) => {
        emit('dealt', false)
      })
      .catch(() => {})
  } else {
    state
      .sDealActions(
        sDealAction.ChangeRendezvous,
        props.deal,
        place.value,
        time.value
      )
      .then((dealState) => {
        emit('dealt', false)
      })
      .catch(() => {})
  }
}
</script>

<template>
  <h4>
    <ion-icon name="chevron-forward-outline" />&nbsp;
    {{
      `Продажа товара ${item.name} в
    количестве ${deal.amount} шт.`
    }}
  </h4>
  <h6>
    Сделка согласована. Чтобы получить оплату покупателю необходимо сообщить код
    оплаты.
  </h6>
  Код оплаты:<span class="text-danger">
    {{ `${state.getPayCode(deal.id)}` }}
  </span>
  <p class="card-text text-muted">
    {{
      `Стоимость заказа ${Number(props.item.price)} $ что эквивалентно ${Number(
        props.item.price / state.getCurrency().eth
      ).toFixed(2)} Eth/Эфира.`
    }}
  </p>
  <small class="block mb-2 font-light text-gray-500 dark:text-white"
    >НЕОБЯЗАТЕЛЬНО. При отзывании сделки вы можете изменить место и время ёё
    проведения
  </small>
  <p class="card-text text-muted">
    Место
    <input
      v-model="place"
      type="text"
      class="w-50"
      :placeholder="props.deal.place"
    />
    &nbsp; Время
    <VueDatePicker
      v-model="time"
      :min-date="new Date()"
      locale="ru"
      :allowed-dates="props.deal.schedule"
    />
  </p>
  <button
    type="button"
    class="btn rounded btn-danger w-50"
    data-bs-toggle="modal"
    data-bs-target="#exampleModal"
    @click="callOffDeal"
  >
    Отозвать сделку
  </button>
</template>
