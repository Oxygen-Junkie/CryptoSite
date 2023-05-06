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

const place = ref('')
const time: Ref<Date | undefined> = ref()
const message = ref('')

const state = useStateStore()

function confirmDeal() {
  if (time.value) {
    state
      .sDealActions(sDealAction.Confirm, props.deal, place.value, time.value)
      .then((dealState) => {
        emit('dealt', false)
      })
      .catch(() => {})
  } else {
    message.value = 'Установите время сделки'
  }
}

function removeDeal() {
  state
    .sDealActions(sDealAction.Remove, props.deal)
    .then((dealState) => {
      emit('dealt', true)
    })
    .catch(() => {})
}
</script>

<template>
  <h4>
    <ion-icon name="chevron-forward-outline" />&nbsp;
    {{
      `Продажа товара ${item.name} в
    количестве ${props.deal.amount} шт.`
    }}
  </h4>
  <h6>Сделка ожидает подтверждения</h6>
  <p class="card-text text-muted">
    {{
      `Стоимость заказа ${Number(props.item.price)} $ что эквивалентно ${Number(
        props.item.price / state.getCurrency().eth
      ).toFixed(2)} Eth/Эфира.`
    }}
  </p>
  <small class="block mb-2 font-light text-gray-500 dark:text-white"
    >Перед продажей проверьте
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

  <div
    v-if="message"
    class="relative px-3 py-3 mb-4 border rounded text-red-darker border-red-dark bg-red-lighter"
  >
    {{ message }}
  </div>

  <button
    type="button"
    class="btn rounded btn-danger w-50"
    data-bs-toggle="modal"
    data-bs-target="#exampleModal"
    @click="confirmDeal()"
  >
    Подтвердить сделку
  </button>
  <button
    type="button"
    class="btn rounded btn-danger w-50"
    data-bs-toggle="modal"
    data-bs-target="#exampleModal"
    @click="removeDeal()"
  >
    Удалить сделку
  </button>
</template>
