<script setup lang="ts">
import Starter from '../starter.vue'
import Deal from '~~/types/deal'
import ItemPrivate from '~~/types/itemPrivate'
import ItemPublic from '~~/types/itemPublic'
import { useStateStore } from '~~/store/state'

const props = defineProps<{
  item: ItemPublic
  deal: Deal
}>()

const state = useStateStore()
</script>

<template>
  <h4>
    <ion-icon name="chevron-forward-outline" />&nbsp;
    {{
      `Покупка товара ${item.name} в
    количестве ${deal.amount} шт.`
    }}
  </h4>
  <h6>Денежный перевод продавцу обрабатывается</h6>
  <p class="card-text text-muted">
    {{
      `Стоимость заказа ${Number(props.item.price)} $ что эквивалентно ${Number(
        props.item.price / state.getCurrency().eth
      ).toFixed(2)} Eth/Эфира.`
    }}
  </p>
</template>
