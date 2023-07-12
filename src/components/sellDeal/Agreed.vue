<script setup lang="ts">
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { useStateStore } from '~/stores/state'
import type Deal from '~/types/deal'
import { sDealAction } from '~/types/enums'
import type ItemPrivate from '~/types/itemPrivate'

const props = defineProps<{
  item: ItemPrivate
  deal: Deal
}>()

const { t } = useI18n()

const emit = defineEmits<{
  (event: 'dealt', sync: boolean): void
}>()

const state = useStateStore()

const place = ref(props.deal.place)
const time = ref(props.deal.time)

function callOffDeal() {
  if (place.value === props.deal.place && time.value === props.deal.time) {
    state
      .sDealActions(sDealAction.CallOff, props.deal)
      .then(() => {
        emit('dealt', false)
      })
      .catch(() => {})
  }
  else {
    state
      .sDealActions(
        sDealAction.ChangeRendezvous,
        props.deal,
        place.value,
        time.value,
      )
      .then(() => {
        emit('dealt', false)
      })
      .catch(() => {})
  }
}
</script>

<template>
  <h4 class="inline-flex font-medium">
    <span class="i-octicon:code-of-conduct-24" />&nbsp;
    <span>{{
      `${t('sellDeal.selling')} ${item.name} ${t('sellDeal.selling')} ${deal.amount} ${t('sellDeal.units')}`
    }}</span>
  </h4>
  <h6 class="font-bald text-red-700">
    {{t('sellDeal.agreed.agreed')}}
  </h6>
  {{ t('sellDeal.agreed.code') }}: &nbsp;<span class="text-red">
    {{ `${state.getPayCode(deal.id)}` }}
  </span>
  <p class="font-thin">
    {{
      `${t('sellDeal.cost')} ${Number(
        props.item.price * parseInt(deal.amount.toString()),
      )} ${t('sellDeal.eq')} ${Number(
        (props.item.price * parseInt(deal.amount.toString()) * 1000)
          / state.getCurrency().eth
          / state.getCurrency().rub,
      ).toFixed(2)} ${t('sellDeal.mw')}`
    }}
  </p>
  <small class="font-thin">{{t('sellDeal.agreed.un')}}
  </small>
  <p class="mb-1 font-medium">
    {{t('sellDeal.created.place')}}
  </p>
  <input
    v-model="place"
    type="text"
    class="w-50"
    :placeholder="props.deal.place"
  >
  <p class="mb-1 font-medium">
    {{t('sellDeal.created.time')}}
  </p>
  <VueDatePicker
    v-model="time"
    :min-date="new Date()"
    class="w-50"
    locale="ru"
    :allowed-dates="props.deal.schedule"
  />
  <button
    type="button"
    class="h-9 border-b-4 border-red-700 rounded bg-red-500 px-4 py-2 font-bold text-white hover:border-red-500 hover:bg-red-400"
    @click="callOffDeal()"
  >
    {{t('sellDeal.agreed.recall')}}
  </button>
</template>
