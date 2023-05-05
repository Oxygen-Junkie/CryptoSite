<script setup lang="ts">
import { useStateStore } from '~/store/state'
import type Deal from '~/types/deal'
import { sDealAction } from '~/types/enums'
import type ItemPrivate from '~/types/itemPrivate'

const props = defineProps<{
  item: ItemPrivate
  deal: Deal
}>()

const place = ref()
const state = useStateStore()

function confirmDeal() {
  state.sDealActions(sDealAction.Confirm, deal.id, )
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
    <input type="text" v-model="place" class="w-50" :placeholder="props.item.defaultPlace" />
    &nbsp; Время
    <VueDatePicker
      :min-date="minDate"
      :max-date="maxDate"
      :range-presets="presets"
      range
      fullscreen-mobile
      :locale="{ lang: 'ru' }"
      validate
    />
  </p>

  <button
    type="button"
    class="btn rounded btn-danger w-50"
    data-bs-toggle="modal"
    data-bs-target="#exampleModal"
    @click="state.sDealActions(sDealAction.Confirm, deal.id)"
  >
    Подтвердить сделку
  </button>
  <button
    type="button"
    class="btn rounded btn-danger w-50"
    data-bs-toggle="modal"
    data-bs-target="#exampleModal"
    @click="state.sDealActions(sDealAction.Remove, deal.id)"
  >
    Удалить сделку
  </button>
</template>
