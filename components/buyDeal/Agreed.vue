<script setup lang="ts">
import { useStateStore } from '~~/store/state'
import Deal from '~~/types/deal'
import { bDealAction } from '~~/types/enums'
import ItemPrivate from '~~/types/itemPrivate'
import ItemPublic from '~~/types/itemPublic'

const props = defineProps<{
  item: ItemPrivate | ItemPublic
  deal: Deal
  ethPrice: any
}>()

const complaint = ref('')
const code = ref('')

const state = useStateStore()

if (props.deal.time) {
  state.learnRendezvous(props.deal.id)
}

const rendezvous = state.user.buyDeals?.find(
  (value) => value.id === props.deal.id
)
</script>

<template>
  <h4>
    <ion-icon name="chevron-forward-outline" />&nbsp;
    {{
      `Покупка товара ${item.name} в
    количестве ${deal.amount} шт.`
    }}
  </h4>
  <h6>Сделка подтверждена. Место сделки задано.</h6>
  <p class="card-text text-muted">
    {{ `Место ${rendezvous!.place} &nbsp; Время ${rendezvous!.time}` }}
  </p>
  <p class="card-text text-muted">
    {{
      `Стоимость заказа ${Number(props.item.price / ethPrice).toFixed(
        2
      )} $ в валютой форме Eth/Эфира.`
    }}
  </p>
  <div class="d-flex justify-content-center">
    <div class="input-group w-auto">
      <input
        v-model="code"
        type="text"
        class="form-control"
        placeholder="Код"
        aria-label="Код"
        aria-describedby="button-addon1"
      />
      <button
        id="button-addon1"
        class="btn btn-danger"
        type="button"
        data-mdb-ripple-color="dark"
        @click="
          state.bDealActions(
            bDealAction.Delivered,
            props.deal.id,
            new ItemPublic(),
            1,
            code
          )
        "
      >
        Подтвердить получение
      </button>
    </div>
  </div>
  <button
    type="button"
    class="btn rounded btn-danger w-50"
    data-bs-toggle="modal"
    data-bs-target="#exampleModal"
  >
    Отменить сделку
  </button>
  <div class="d-flex justify-content-center">
    <div class="input-group w-auto">
      <input
        v-model="complaint"
        type="text"
        class="form-control"
        placeholder="Жалоба"
        aria-label="Жалоба"
        aria-describedby="button-addon1"
      />
      <button
        id="button-addon1"
        class="btn btn-danger"
        type="button"
        data-mdb-ripple-color="dark"
        @click="
          state.bDealActions(
            bDealAction.Complain,
            props.deal.id,
            new ItemPublic(),
            1,
            '',
            complaint
          )
        "
      >
        Оставить жалобу на предоставленный товар
      </button>
    </div>
  </div>
</template>
