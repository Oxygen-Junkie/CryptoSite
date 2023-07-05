<script setup lang="ts">
import { useStateStore } from '~/stores/state'
import { itemPaletteMode, reputation } from '~/types/enums'
import type ItemPrivate from '~/types/itemPrivate'
import type ItemPublic from '~/types/itemPublic'

const props = defineProps<{
  item: ItemPrivate | ItemPublic
  mode: itemPaletteMode
}>()

const { t } = useI18n()

const state = useStateStore()
const color = ref('white')
const currency = ref(state.getCurrency())

if (
  props.mode === itemPaletteMode.inGeneral
  || props.mode === itemPaletteMode.inDeal
) {
  const i = props.item as ItemPublic
  switch (i.sellerReputation) {
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
      color.value = 'white'
      break
    }
  }
}
</script>

<template>
  <div id="item" class="relative from-gray-100 to-gray-400 bg-gradient-to-r">
    <img
      :src="`https://ipfs.io/ipfs/${props.item.imageCID}`"
      :alt="`Image of ${props.item.name}`"
      class="h-full"
    >
    <h1
      class="absolute left-1/2 top-1/2 from-gray-500 to-gray-800 bg-gradient-to-r -translate-x-1/2 -translate-y-1/2"
      :style="`color: ${color}`"
    >
      {{ props.item.name }}
    </h1>
    <h3
      class="absolute left-5 top-5 from-gray-400 to-gray-100 bg-gradient-to-r font-bold"
    >
      {{
        `${props.item.price}₽` }} {{ t('or') }} {{ `${Number(
        (props.item.price * 1000) / currency.eth / currency.rub,
      ).toFixed(2)}Mwei`
      }}
    </h3>
    <h3 class="absolute bottom-1 left-1 right-5 text-xs font-light">
      {{
        `${props.item.tag[0].name}${
          props.item.tag.length > 1 ? `, ${props.item.tag[1].name}....` : `...`
        }`
      }}
    </h3>
  </div>
</template>

<style scoped>
#item {
  width: 15rem;
  height: 15rem;
  display: grid;
  grid-template-rows: repeat(3, 1fr);
}

#item:hover {
  transform: scale(1.05);
  cursor: pointer;
}
</style>
