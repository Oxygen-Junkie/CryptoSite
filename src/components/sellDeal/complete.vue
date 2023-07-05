<script setup lang="ts">
import { useStateStore } from '~/stores/state'
import type Deal from '~/types/deal'
import type ItemPrivate from '~/types/itemPrivate'

const props = defineProps<{
  item: ItemPrivate
  deal: Deal
}>()

const state = useStateStore()
</script>

<template>
  <h4 class="inline-flex font-medium">
    <span class="i-ant-design:check-outlined" />&nbsp;
    <span>{{
      `Продажа товара ${item.name} в
    количестве ${deal.amount} шт.`
    }}</span>
  </h4>
  <h6 class="font-bald text-red-700">
    Сделка ожидает обработки оплаты.
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
</template>
