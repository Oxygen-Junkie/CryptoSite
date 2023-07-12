<script setup lang="ts">
import type { Ref } from 'vue'
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

const emit = defineEmits<{
  (event: 'dealt', sync: boolean): void
}>()

const { t } = useI18n()

const place = ref('')
const time: Ref<Date | undefined> = ref()
const message = ref('')

const state = useStateStore()

function confirmDeal() {
  if (time.value) {
    state
      .sDealActions(sDealAction.Confirm, props.deal, place.value, time.value)
      .then(() => {
        emit('dealt', false)
      })
      .catch(() => {})
  }
  else {
    message.value = t('sellDeal.created.setTime')
  }
}

function removeDeal() {
  state
    .sDealActions(sDealAction.Remove, props.deal)
    .then(() => {
      emit('dealt', true)
    })
    .catch(() => {})
}
</script>

<template>
  <h4 class="inline-flex font-medium">
    <span class="i-octicon-briefcase-16" />&nbsp;
    <span>{{
      `${t('sellDeal.selling')} ${item.name} ${t('sellDeal.selling')} ${deal.amount} ${t('sellDeal.units')}`
    }}</span>
  </h4>
  <h6 class="font-bald text-red-700">
    {{t('sellDeal.created.confirmation')}}
  </h6>
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
  <small class="font-bald">{{t('sellDeal.created.check')}}&nbsp; </small>
  <p class="mb-1 font-medium">
    {{t('sellDeal.created.place')}}
  </p>
  &nbsp;
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
    locale="ru"
    :allowed-dates="props.deal.schedule"
  />

  <div v-if="message" class="font-bald text-red-700">
    {{ message }}
  </div>

  <button
    type="button"
    class="h-9 border-b-4 border-red-700 rounded bg-red-500 px-4 py-2 font-bold text-white hover:border-red-500 hover:bg-red-400"
    @click="confirmDeal()"
  >
  {{t('sellDeal.created.confirm')}}
  </button>
  <button
    type="button"
    class="h-9 border-b-4 border-yellow-700 rounded bg-yellow-500 px-4 py-2 font-bold text-white hover:border-yellow-500 hover:bg-yellow-400"
    @click="removeDeal()"
  >
  {{t('sellDeal.created.delete')}}
  </button>
</template>
