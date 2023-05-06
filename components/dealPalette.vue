<script setup lang="ts">
import Unsynced from '~~/components/unsynced.vue'
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

const sync = ref(true)

const state = useStateStore()
const currency = state.getCurrency()
</script>

<template>
  <Container v-if="props.mode === dealPaletteMode.buyDeal">
    <div v-if="props.deal.synced.seller && sync">
      <BuyDealAborted
        v-if="props.deal.state === dealState.Aborted"
        :deal="props.deal"
        :item="(item as ItemPublic)"
        @dealt="(synced: boolean) => {
        sync = synced
      }"
      />
      <BuyDealArchived
        v-else-if="props.deal.state === dealState.Archived"
        :deal="props.deal"
        :item="(item as ItemPublic)"
        @dealt="(synced: boolean) => {
        sync = synced
      }"
      />
      <BuyDealAgreed
        v-else-if="props.deal.state === dealState.Agreed"
        :deal="props.deal"
        :item="(item as ItemPublic)"
        @dealt="(synced: boolean) => {
        sync = synced
      }"
      />
      <BuyDealComplete
        v-else-if="props.deal.state === dealState.Complete"
        :deal="props.deal"
        :item="(item as ItemPublic)"
        @dealt="(synced: boolean) => {
        sync = synced
      }"
      />
      <BuyDealCreated
        v-else-if="props.deal.state === dealState.Created"
        :deal="props.deal"
        :item="(item as ItemPublic)"
        @dealt="(synced: boolean) => {
        sync = synced
      }"
      />
    </div>
    <div v-else>
      <Unsynced :deal="props.deal" :item="item" />
    </div>
  </Container>
  <Container v-if="props.mode === dealPaletteMode.sellDeal">
    <div v-if="props.deal.synced.buyer && sync">
      <SellDealAborted
        v-if="props.deal.state === dealState.Aborted"
        :deal="props.deal"
        :item="(item as ItemPublic)"
        @dealt="(synced: boolean) => {
        sync = synced
      }"
      />
      <SellDealArchived
        v-else-if="props.deal.state === dealState.Archived"
        :deal="props.deal"
        :item="(item as ItemPrivate)"
        @dealt="(synced: boolean) => {
        sync = synced
      }"
      />
      <SellDealAgreed
        v-else-if="props.deal.state === dealState.Agreed"
        :deal="props.deal"
        :item="(item as ItemPrivate)"
        @dealt="(synced: boolean) => {
        sync = synced
      }"
      />
      <SellDealComplete
        v-else-if="props.deal.state === dealState.Complete"
        :deal="props.deal"
        :item="(item as ItemPrivate)"
        @dealt="(synced: boolean) => {
        sync = synced
      }"
      />
      <SellDealCreated
        v-else-if="props.deal.state === dealState.Created"
        :deal="props.deal"
        :item="(item as ItemPrivate)"
        @dealt="(synced: boolean) => {
        sync = synced
      }"
      />
    </div>
    <div v-else>
      <Unsynced :deal="props.deal" :item="item" />
    </div>
  </Container>
</template>
