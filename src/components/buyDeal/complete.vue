<script setup lang="ts">
import type Deal from '~/types/deal'
import type ItemPublic from '~/types/itemPublic'
import { useStateStore } from '~/stores/state'

const props = defineProps<{
  item: ItemPublic
  deal: Deal
}>()

const state = useStateStore()
</script>

<template>
  <h4 class="inline-flex font-medium">
    <span class="i-la-check" />&nbsp;
    <span>{{
      `Покупка товара ${item.name} в
    количестве ${deal.amount} шт.`
    }}</span>
  </h4>
  <h6 class="font-bald text-red-700">
    Денежный перевод продавцу обрабатывается
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
