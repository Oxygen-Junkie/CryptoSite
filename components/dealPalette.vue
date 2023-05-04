<script setup lang="ts">
import aborted from './buyDeal/aborted.vue'
import archived from './buyDeal/archived.vue'
import agreed from './buyDeal/agreed.vue'
import complete from './buyDeal/complete.vue'
import created from './buyDeal/created.vue'
import Aborted from './sellDeal/aborted.vue'
import Archived from './sellDeal/archived.vue'
import Agreed from './sellDeal/agreed.vue'
import Complete from './sellDeal/complete.vue'
import Created from './sellDeal/created.vue'
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
    <aborted
      v-if="deal.state === dealState.Aborted"
      :deal="deal"
      :item="(item as ItemPublic)"
    />
    <archived
      v-else-if="deal.state === dealState.Archived"
      :deal="deal"
      :item="(item as ItemPublic)"
    />
    <agreed
      v-else-if="deal.state === dealState.Agreed"
      :deal="deal"
      :item="(item as ItemPublic)"
    />
    <complete
      v-else-if="deal.state === dealState.Complete"
      :deal="deal"
      :item="(item as ItemPublic)"
    />
    <created
      v-else-if="deal.state === dealState.Created"
      :deal="deal"
      :item="(item as ItemPublic)"
    />
  </Container>
  <Container v-if="props.mode === dealPaletteMode.sellDeal">
    <Aborted
      v-if="deal.state === dealState.Aborted"
      :deal="deal"
      :item="(item as ItemPrivate)"
    />
    <Archived
      v-else-if="deal.state === dealState.Archived"
      :deal="deal"
      :item="(item as ItemPrivate)"
    />
    <Agreed
      v-else-if="deal.state === dealState.Agreed"
      :deal="deal"
      :item="(item as ItemPrivate)"
    />
    <Complete
      v-else-if="deal.state === dealState.Complete"
      :deal="deal"
      :item="(item as ItemPrivate)"
    />
    <Created
      v-else-if="deal.state === dealState.Created"
      :deal="deal"
      :item="(item as ItemPrivate)"
    />
  </Container>
</template>
