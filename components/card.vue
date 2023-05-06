<script setup lang="ts">
import { useStateStore } from '~~/store/state'
import { itemPaletteMode, reputation } from '~~/types/enums'
import ItemPrivate from '~~/types/itemPrivate'
import ItemPublic from '~~/types/itemPublic'

const props = defineProps<{
  item: ItemPrivate | ItemPublic
  mode: itemPaletteMode
}>()

const state = useStateStore()
const color = ref('currentColor')
const currency = state.getCurrency()

if (props.item instanceof ItemPublic) {
  switch (props.item.sellerReputation) {
    case reputation.OneDeal: {
      color.value = '#fbff00'
      break
    }
    case reputation.FewDeals: {
      color.value = '#ceff48'
      break
    }
    case reputation.Established: {
      color.value = '#2bff00'
      break
    }
    default: {
      color.value = 'currentColor'
      break
    }
  }
}
</script>

<template>
  <div class="card border-0 w-100">
    <nuxt-img
      :src="`https://ipfs.io/ipfs/${props.item.imageCID}`"
      class="card-img-top"
      :alt="`Image of ${props.item.name}`"
      loading="lazy"
    />
    <div class="card-body">
      <h5 class="card-title">
        <p class="text-truncate" style="color: currentColor">
          {{ props.item.name }}
        </p>
        <p class="badge bg-success">
          {{
            `${props.item.price}$ или ${Number(
              props.item.price / currency.eth
            ).toFixed(2)}eth`
          }}
        </p>
      </h5>
      <p class="card-text text-muted">
        {{
          `${props.item.tag[1].name}${
            props.item.tag[2].name ? `, ${props.item.tag[2].name}...` : `...`
          }`
        }}
      </p>
    </div>
  </div>
</template>

<style>
.card-img-top {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
</style>
