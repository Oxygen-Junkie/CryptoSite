<script setup lang="ts">
import { useStateStore } from '~/stores/state'
import type Deal from '~/types/deal'
import type ItemPrivate from '~/types/itemPrivate'
import type ItemPublic from '~/types/itemPublic'

const props = defineProps<{
  item: ItemPublic | ItemPrivate
  deal: Deal
}>()

const state = useStateStore()
</script>

<template>
  <h4 class="inline-flex font-medium">
    <icon-system-uicons:refresh-alt />&nbsp;
    <span>
      {{
        `Покупка товара ${item.name} в
    количестве ${deal.amount} шт.`
      }}</span>
  </h4>
  <h6>Сделка совершена. Продавец получил оплату.</h6>
  <p class="font-thin">
    {{
      `Стоимость заказа ${Number(props.item.price)} ₽ что эквивалентно ${Number(
        props.item.price / state.getCurrency().eth / state.getCurrency().rub,
      ).toFixed(2)} Mwei`
    }}
  </p>
</template>
