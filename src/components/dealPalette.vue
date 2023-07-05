<script setup lang="ts">
import Unsynced from '~/components/unsynced.vue'
import Container from '~/components/container.vue'
import type Deal from '~/types/deal'
import { dealPaletteMode, dealState } from '~/types/enums'
import ItemPrivate from '~/types/itemPrivate'
import ItemPublic from '~/types/itemPublic'
import BuyDealAborted from '~/components/buyDeal/aborted.vue'
import BuyDealArchived from '~/components/buyDeal/archived.vue'
import BuyDealAgreed from '~/components/buyDeal/Agreed.vue'
import BuyDealComplete from '~/components/buyDeal/complete.vue'
import BuyDealCreated from '~/components/buyDeal/created.vue'
import SellDealAborted from '~/components/sellDeal/Aborted.vue'
import SellDealArchived from '~/components/sellDeal/archived.vue'
import SellDealAgreed from '~/components/sellDeal/Agreed.vue'
import SellDealComplete from '~/components/sellDeal/complete.vue'
import SellDealCreated from '~/components/sellDeal/Created.vue'

const props = defineProps<{
  deal: Deal
  mode: dealPaletteMode
  item: ItemPrivate | ItemPublic
}>()

const sync = ref(true)
</script>

<template>
  <div class="bg-white dark:bg-dark-200">
    <Container v-if="props.mode === dealPaletteMode.buyDeal">
      <div v-if="props.deal.synced.seller && sync">
        <BuyDealAborted
          v-if="props.deal.state === dealState.Aborted"
          :deal="props.deal"
          :item="item as ItemPublic"
          @dealt="(synced: boolean) => {
            sync = synced
          }"
        />
        <BuyDealArchived
          v-else-if="props.deal.state === dealState.Archived"
          :deal="props.deal"
          :item="item as ItemPublic"
          @dealt="(synced: boolean) => {
            sync = synced
          }"
        />
        <BuyDealAgreed
          v-else-if="props.deal.state === dealState.Agreed"
          :deal="props.deal"
          :item="item as ItemPublic"
          @dealt="(synced: boolean) => {
            sync = synced
          }"
        />
        <BuyDealComplete
          v-else-if="props.deal.state === dealState.Complete"
          :deal="props.deal"
          :item="item as ItemPublic"
          @dealt="(synced: boolean) => {
            sync = synced
          }"
        />
        <BuyDealCreated
          v-else-if="props.deal.state === dealState.Created"
          :deal="props.deal"
          :item="item as ItemPublic"
          @dealt="(synced: boolean) => {
            sync = synced
          }"
        />
      </div>
      <div v-else class="from-gray-200 to-white bg-gradient-to-r">
        <Unsynced :deal="props.deal" :item="item" />
      </div>
    </Container>
    <Container v-if="props.mode === dealPaletteMode.sellDeal">
      <div
        v-if="props.deal.synced.buyer && sync"
        class="bg-white dark:bg-dark-200"
      >
        <SellDealAborted
          v-if="props.deal.state === dealState.Aborted"
          :deal="props.deal"
          :item="item as ItemPrivate"
          @dealt="(synced: boolean) => {
            sync = synced
          }"
        />
        <SellDealArchived
          v-else-if="props.deal.state === dealState.Archived"
          :deal="props.deal"
          :item="item as ItemPrivate"
          @dealt="(synced: boolean) => {
            sync = synced
          }"
        />
        <SellDealAgreed
          v-else-if="props.deal.state === dealState.Agreed"
          :deal="props.deal"
          :item="item as ItemPrivate"
          @dealt="(synced: boolean) => {
            sync = synced
          }"
        />
        <SellDealComplete
          v-else-if="props.deal.state === dealState.Complete"
          :deal="props.deal"
          :item="item as ItemPrivate"
          @dealt="(synced: boolean) => {
            sync = synced
          }"
        />
        <SellDealCreated
          v-else-if="props.deal.state === dealState.Created"
          :deal="props.deal"
          :item="item as ItemPrivate"
          @dealt="(synced: boolean) => {
            sync = synced
          }"
        />
      </div>
      <div v-else class="from-white to-gray-200 bg-gradient-to-r">
        <Unsynced :deal="props.deal" :item="item" />
      </div>
    </Container>
  </div>
</template>
