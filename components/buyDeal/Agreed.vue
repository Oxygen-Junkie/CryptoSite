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
  (event: 'dealt', sync: dealState): void
}>()

const complaint = ref('')
const code = ref('')
const buyerSchedule = ref()
const message = ref('')

const state = useStateStore()

function complain() {
  state
    .bDealActions(
      bDealAction.Complain,
      props.deal.id,
      new ItemPublic(),
      1,
      '',
      complaint.value
    )
    .then((dealState) => {
      emit('dealt', dealState)
    })
    .catch(() => {})
}

function delivered() {
  state
    .bDealActions(
      bDealAction.Delivered,
      props.deal.id,
      new ItemPublic(),
      1,
      code.value
    )
    .then((dealState) => {
      emit('dealt', dealState)
    })
    .catch(() => {
      message.value = 'Код не правильный'
    })
}

function abortDeal() {
  state
    .bDealActions(bDealAction.Abort, props.deal.id)
    .then((dealState) => {
      emit('dealt', dealState)
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
  <h6>Сделка подтверждена. Место сделки задано.</h6>
  <p class="card-text text-muted">Место &nbsp; {{ props.deal.place }}</p>
  <p>
    Удобные для вас даты получения товара &nbsp;
    <VueDatePicker
      v-model="buyerSchedule"
      :min-date="new Date()"
      multi-dates
      locale="ru"
      :allowed-dates="props.deal.schedule"
    />
  </p>
  <p class="card-text text-muted">
    {{
      `Стоимость заказа ${Number(props.item.price)} $ что эквивалентно ${Number(
        props.item.price / state.getCurrency().eth
      ).toFixed(2)} Eth/Эфира.`
    }}
  </p>
  <div class="d-flex justify-content-center">
    <div class="input-group w-auto">
      <input
        v-model="code"
        type="text"
        class="form-control"
        placeholder="Код из 5 цифр"
        aria-label="Код из 5 цифр"
        aria-describedby="button-addon1"
      />
      <button
        id="button-addon1"
        class="btn btn-danger"
        type="button"
        data-mdb-ripple-color="dark"
        @click="delivered()"
      >
        Подтвердить получение
      </button>
    </div>
  </div>
  <div
    v-if="message"
    class="relative px-3 py-3 mb-4 border rounded text-red-darker border-red-dark bg-red-lighter"
  >
    {{ message }}
  </div>
  <button
    type="button"
    class="btn rounded btn-danger w-50"
    data-bs-toggle="modal"
    data-bs-target="#exampleModal"
    @click="abortDeal()"
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
        @click="complain"
      >
        Оставить жалобу на предоставленный товар
      </button>
    </div>
  </div>
</template>
