<script setup lang="ts">
import { useStateStore } from '~/stores/state'
import type Deal from '~/types/deal'
import type ItemPrivate from '~/types/itemPrivate'

const props = defineProps<{
  item: ItemPrivate
  deal: Deal
}>()

const { t } = useI18n()

const state = useStateStore()
</script>

<template>
  <h4 class="inline-flex font-medium">
    <span class="i-ant-design:check-outlined" />&nbsp;
    <span>{{
      `${t('sellDeal.selling')} ${item.name} ${t('sellDeal.selling')} ${deal.amount} ${t('sellDeal.units')}`
    }}</span>
  </h4>
  <h6 class="font-bald text-red-700">
    {{t('sellDeal.complete.await')}}
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
</template>
