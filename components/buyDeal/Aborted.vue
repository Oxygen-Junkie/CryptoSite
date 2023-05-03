<script setup lang="ts">
import Deal from '~~/types/deal'
import ItemPrivate from '~~/types/itemPrivate'
import ItemPublic from '~~/types/itemPublic'

const props = defineProps<{
  item: ItemPrivate | ItemPublic
  deal: Deal
  ethPrice: any
}>()
</script>

<template>
  <h4>
    <ion-icon name="chevron-forward-outline" />&nbsp;
    {{
      `Покупка товара ${item.name} в
    количестве ${deal.amount} шт.`
    }}
  </h4>
  <h6>Сделка ожидает подтверждения</h6>
  <p class="card-text text-muted">
    {{
      `Стоимость заказа ${Number(props.item.price / ethPrice).toFixed(
        2
      )} $ в валютой форме Eth/Эфира.`
    }}
  </p>
  <button
    type="button"
    class="btn rounded btn-danger w-50"
    data-bs-toggle="modal"
    data-bs-target="#exampleModal"
  >
    Отменить сделку
  </button>
</template>
