<script setup lang="ts">
import { useStateStore } from '~~/store/state'
import Deal from '~~/types/deal'
import { bDealAction, dealState } from '~~/types/enums'
import ItemPublic from '~~/types/itemPublic'

const props = defineProps<{
  item: ItemPublic
  deal: Deal
}>()

const emit = defineEmits<{
  (event: 'dealt', dealState: dealState): void
}>()

const state = useStateStore()

function abortDeal() {
  state
    .bDealActions(bDealAction.Abort, props.deal.id)
    .then(() => {
      emit('dealt', dealState.Aborted)
    })
    .catch(() => {})
}
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
      `Стоимость заказа ${Number(props.item.price)} $ что эквивалентно ${Number(
        props.item.price / state.getCurrency().eth
      ).toFixed(2)} Eth/Эфира.`
    }}
  </p>
  <button
    type="button"
    class="btn rounded btn-danger w-50"
    data-bs-toggle="modal"
    data-bs-target="#exampleModal"
    @click="abortDeal()"
  >
    Отменить сделку
  </button>
</template>
