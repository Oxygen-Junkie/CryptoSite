<script setup lang="ts">
import Container from '~~/components/container.vue'
import { useStateStore } from '~~/store/state'
import Deal from '~~/types/deal'
import { dealPaletteMode, dealState } from '~~/types/enums'
import ItemPrivate from '~~/types/itemPrivate'
import ItemPublic from '~~/types/itemPublic'

const props = defineProps<{
  deal: Deal
  mode: dealPaletteMode
  item: ItemPrivate | ItemPublic
}>()

const state = useStateStore()
const currency = state.getCurrency()
</script>

<template>
  <Container v-if="props.mode === dealPaletteMode.buyDeal">
    <BuyDealAborted
      v-if="props.deal.state === dealState.Aborted"
      :deal="props.deal"
      :item="(item as ItemPublic)"
      @dealt="(dealState: dealState) => {
        state.scanDeals()
      }"
    />
    <BuyDealArchived
      v-else-if="props.deal.state === dealState.Archived"
      :deal="props.deal"
      :item="(item as ItemPublic)"
      @dealt="(dealState: dealState) => {
        state.scanDeals()
      }"
    />
    <BuyDealAgreed
      v-else-if="props.deal.state === dealState.Agreed"
      :deal="props.deal"
      :item="(item as ItemPublic)"
      @dealt="(dealState: dealState) => {
        state.scanDeals()
      }"
    />
    <BuyDealComplete
      v-else-if="props.deal.state === dealState.Complete"
      :deal="props.deal"
      :item="(item as ItemPublic)"
      @dealt="(dealState: dealState) => {
        state.scanDeals()
      }"
    />
    <BuyDealCreated
      v-else-if="props.deal.state === dealState.Created"
      :deal="props.deal"
      :item="(item as ItemPublic)"
      @dealt="(dealState: dealState) => {
        state.scanDeals()
      }"
    />
  </Container>
  <Container v-if="props.mode === dealPaletteMode.sellDeal">
    <SellDealAborted
      v-if="props.deal.state === dealState.Aborted"
      :deal="props.deal"
      :item="(item as ItemPrivate)"
    />
    <SellDealArchived
      v-else-if="props.deal.state === dealState.Archived"
      :deal="props.deal"
      :item="(item as ItemPrivate)"
      @dealt="(dealState: dealState) => {
        state.scanDeals()
      }"
    />
    <SellDealAgreed
      v-else-if="props.deal.state === dealState.Agreed"
      :deal="props.deal"
      :item="(item as ItemPrivate)"
      @dealt="(dealState: dealState) => {
        state.scanDeals()
      }"
    />
    <SellDealComplete
      v-else-if="props.deal.state === dealState.Complete"
      :deal="props.deal"
      :item="(item as ItemPrivate)"
      @dealt="(dealState: dealState) => {
        state.scanDeals()
      }"
    />
    <SellDealCreated
      v-else-if="props.deal.state === dealState.Created"
      :deal="props.deal"
      :item="(item as ItemPrivate)"
      @dealt="(dealState: dealState) => {
        state.scanDeals()
      }"
    />
  </Container>
</template>
