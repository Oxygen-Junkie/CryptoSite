<script setup lang="ts">
import type { Ref } from 'vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { bDealAction, reputation } from '~/types/enums'
import { useStateStore } from '~/stores/state'
import type ItemPublic from '~/types/itemPublic'

const props = defineProps<{
  item: ItemPublic
}>()

const emit = defineEmits<{
  (event: 'closed'): void
}>()

const { t, locale } = useI18n()

const purchased = ref(true)
const store = useStateStore()
const comission: Ref<number | undefined> = ref()
store.getComission().then((com) => {
  comission.value = com
})
const color = ref('currentColor')
const rep = ref(t('viewModal.none'))
const amount = ref(1)
const buyerSchedule: Ref<Date[] | undefined> = ref([new Date(2023, 8, 2, 12, 10), new Date(2023, 8, 10, 11, 30)])

function buy() {
  if (amount.value > 0) {
    store
      .bDealActions(
        bDealAction.Start,
        props.item,
        amount.value,
        '',
        '',
        buyerSchedule.value,
      )
      .then(() => {
        purchased.value = false
      })
  }
}

switch (props.item.sellerReputation) {
  case reputation.OneDeal: {
    color.value = '#fbff00'
    rep.value = t('viewModal.acceptable')
    break
  }
  case reputation.FewDeals: {
    color.value = '#ceff48'
    rep.value = t('viewModal.good')
    break
  }
  case reputation.Established: {
    color.value = '#2bff00'
    rep.value = t('viewModal.great')
    break
  }
  default: {
    color.value = 'currentColor'
    rep.value = t('viewModal.new')
    break
  }
}
</script>

<template>
  <div v-if="purchased" class="p-1">
    <img
      :src="`https://ipfs.io/ipfs/${props.item.imageCID}`"
      class="product-img mx-auto rounded"
    >
    <div>
      <label><strong
        class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
      >{{t('viewModal.name')}}:</strong></label>
      <span>
        {{ props.item.name }}
      </span>
    </div>
    <div class="py-4" style="display: flex">
      <span
        class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
        style="width: 150px"
      >
        {{ props.item.description }}
      </span>

      <div class="pl-4 text-left" style="width: 150px">
        <div class="pb-2">
          <span
            class="mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >{{t('viewModal.sellerHas')}}&nbsp;<span :style="`color: ${color}`">{{ rep }}</span>&nbsp;{{t('viewModal.reputation')}} </span>
        </div>
        <div class="py-2">
          <label
            class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >{{t('viewModal.setSchedule')}}:</label>
          <VueDatePicker
            v-model="buyerSchedule"
            :min-date="new Date()"
            multi-dates
            class="w-50"
            :locale="locale"
            :allowed-dates="props.item.schedule"
          />
        </div>
        <div class="py-2">
          <small
            class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >{{t('viewModal.prod')}}:</small><small>
            {{ ` ${props.item.producer}` }}
          </small>
        </div>
      </div>
    </div>
    <div v-if="comission" class="py-2">
      <label><strong>{{t('viewModal.numOfGoods')}}:</strong></label><br>
      <input
        v-model="amount"
        type="number"
        class="block w-full border border-gray-300 rounded-lg bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-500 focus:border-red-500 dark:bg-gray-600 dark:text-white focus:ring-red-500 dark:placeholder-gray-400"
        :max="props.item.availability"
        min="1"
      >
      <p class="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
        {{ `${amount} ${t('viewModal.units')} ${props.item.price}₽ ` }}
      </p>
      <p class="mb-2 block text-sm font-thin text-gray-900 dark:text-white">
        {{ `${t('viewModal.commission')} ${amount * props.item.price * comission}₽ ` }}
      </p>
      <strong
        v-show="amount > 1"
        class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
      >{{ ` ${t('viewModal.cost')}: ${amount * props.item.price * (1 + comission)!}₽ ${t('viewModal.eq')} ${Number((props.item.price * amount * 1000 * (1 + comission) / store.getCurrency().eth / store.getCurrency().rub).toFixed(2))} Mwei` }}</strong>
    </div>

    <button
      class="rounded-lg bg-red-700 px-5 py-2.5 text-center text-sm font-medium text-white dark:bg-red-600 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:hover:bg-red-700 dark:focus:ring-red-800"
      @click="buy"
    >
      {{t('viewModal.startDeal')}}
    </button>
  </div>
  <div v-else>
    <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">
      {{t('viewModal.go')}}
    </h3>
    <button
      type="submit"
      class="w-full rounded-lg bg-red-700 px-5 py-2.5 text-center text-sm font-medium text-white dark:bg-red-600 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:hover:bg-red-700 dark:focus:ring-red-800"
      @click="emit('closed')"
    >
      Ок
    </button>
  </div>
</template>
