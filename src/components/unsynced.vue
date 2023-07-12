<script setup lang="ts">
import { useStateStore } from '~/stores/state'
import type Deal from '~/types/deal'
import type ItemPrivate from '~/types/itemPrivate'
import type ItemPublic from '~/types/itemPublic'

const props = defineProps<{
  item: ItemPublic | ItemPrivate
  deal: Deal
}>()

const { t } = useI18n()

const state = useStateStore()
</script>

<template>
  <h4 class="inline-flex font-medium">
    <icon-system-uicons:refresh-alt />&nbsp;
    <span>
      {{
        `${t('unsynced.unsynced')} ${item.name} ${t('sellDeal.in')} ${deal.amount} ${t('sellDeal.units')}`
      }}</span>
  </h4>
  <h6>{{t('unsynced.unsynced')}}</h6>
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
