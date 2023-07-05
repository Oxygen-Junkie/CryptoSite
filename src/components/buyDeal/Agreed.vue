<script setup lang="ts">
import { useStateStore } from '~/stores/state'
import type Deal from '~/types/deal'
import { bDealAction } from '~/types/enums'
import ItemPublic from '~/types/itemPublic'

const props = defineProps<{
  item: ItemPublic
  deal: Deal
}>()

const emit = defineEmits<{
  (event: 'dealt', sync: boolean): void
}>()

const complaint = ref('')
const code = ref('')
const message = ref('')

const state = useStateStore()

function complain() {
  state
    .bDealActions(
      bDealAction.Complain,
      new ItemPublic(),
      1,
      '',
      complaint.value,
      [new Date()],
      props.deal,
    )
    .then(() => {
      emit('dealt', true)
    })
    .catch(() => {})
}

function delivered() {
  state
    .bDealActions(
      bDealAction.Delivered,
      new ItemPublic(),
      1,
      code.value,
      '',
      [new Date()],
      props.deal,
    )
    .then(() => {
      emit('dealt', true)
    })
    .catch(() => {
      message.value = 'Код не правильный'
    })
}

function abortDeal() {
  state
    .bDealActions(
      bDealAction.Abort,
      new ItemPublic(),
      1,
      '',
      '',
      [new Date()],
      props.deal,
    )
    .then(() => {
      emit('dealt', false)
    })
    .catch(() => {})
}
</script>

<template>
  <h4 class="inline-flex font-medium">
    <span class="i-la-bitbucket" />&nbsp;
    <span>{{
      `Покупка товара ${item.name} в
    количестве ${deal.amount} шт.`
    }}</span>
  </h4>
  <h6 class="font-bald text-red-700">
    Сделка подтверждена. Место сделки задано.
  </h6>
  <p class="font-medium">
    Место &nbsp; {{ props.deal.place }}
  </p>
  <p class="font-medium">
    Дата получения товара установленная покупателем: &nbsp;
    {{ props.deal.time?.toLocaleString() }}
  </p>
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
  <div class="d-flex justify-content-center">
    <div class="input-group w-auto">
      <input
        v-model="code"
        type="text"
        class="form-control border-black"
        placeholder="Код из 5 цифр"
        aria-label="Код из 5 цифр"
        aria-describedby="button-addon1"
      >
      <button
        id="button-addon1"
        class="h-9 border-b-4 border-red-700 rounded bg-red-500 px-4 py-2 font-bold text-white hover:border-red-500 hover:bg-red-400"
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
    class="text-red-darker border-red-dark bg-red-lighter relative mb-4 border rounded px-3 py-3"
  >
    {{ message }}
  </div>
  <div class="d-flex justify-content-center">
    <div class="input-group w-auto">
      <input
        v-model="complaint"
        type="text"
        class="form-control border-black"
        placeholder="Жалоба"
        aria-label="Жалоба"
        aria-describedby="button-addon1"
      >
      <button
        id="button-addon1"
        class="h-9 border-b-4 border-purple-700 rounded bg-purple-500 px-4 py-2 font-bold text-white hover:border-purple-500 hover:bg-purple-400"
        type="button"
        @click="complain()"
      >
        Оставить жалобу на предоставленный товар
      </button>
    </div>
  </div>
  <button
    type="button"
    class="h-9 border-b-4 border-yellow-700 rounded bg-yellow-500 px-4 py-2 font-bold text-white hover:border-yellow-500 hover:bg-yellow-400"
    @click="abortDeal()"
  >
    Отменить сделку
  </button>
</template>
