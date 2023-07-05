<script setup lang="ts">
import { useStateStore } from '~/stores/state'
import type Deal from '~/types/deal'
import { bDealAction } from '~/types/enums'
import ItemPublic from '~/types/itemPublic'

const props = defineProps<{
  item: ItemPublic
  deal: Deal
}>()

const emit = defineEmits<{
  (event: 'dealt', sync: boolean): void
}>()

const state = useStateStore()

function abortDeal() {
  state
    .bDealActions(
      bDealAction.Abort,
      new ItemPublic(),
      1,
      '',
      '',
      [new Date()],
      props.deal,
    )
    .then(() => {
      emit('dealt', false)
    })
    .catch(() => {})
}
</script>

<template>
  <h4 class="inline-flex font-medium">
    <span class="i-la-angellist" />&nbsp;
    <span>{{
      `Покупка товара ${item.name} в
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
  <button
    type="button"
    class="h-9 border-b-4 border-red-700 rounded bg-red-500 px-4 py-2 font-bold text-white hover:border-red-500 hover:bg-red-400"
    @click="abortDeal()"
  >
    Отменить сделку
  </button>
</template>
