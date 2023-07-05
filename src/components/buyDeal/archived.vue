<script setup lang="ts">
import { useStateStore } from '~/stores/state'
import type Deal from '~/types/deal'
import type ItemPublic from '~/types/itemPublic'

const props = defineProps<{
  item: ItemPublic
  deal: Deal
}>()

const state = useStateStore()
</script>

<template>
  <h4 class="inline-flex font-medium">
    <span class="i-la-folder-open-solid" />&nbsp;
    <span>{{
      `Покупка товара ${item.name} в
    количестве ${deal.amount} шт.`
    }}</span>
  </h4>
  <h6 class="font-bald text-red-700">
    Сделка совершена. Продавец получил оплату.
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
