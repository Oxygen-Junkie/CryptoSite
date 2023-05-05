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
  (event: 'dealt', dealState: dealState): void
}>()

const state = useStateStore()

function removeDeal() {
  state
    .sDealActions(sDealAction.Remove, props.deal.id)
    .then(() => {
      emit('dealt', dealState.Removed)
    })
    .catch(() => {})
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
  <h6>Сделка отменена покупателем.</h6>
  <p class="card-text text-muted">
    {{
      `Стоимость заказа ${Number(
        props.item.price / state.getCurrency().eth
      ).toFixed(2)} $ в валютой форме Eth/Эфира.`
    }}
  </p>
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
