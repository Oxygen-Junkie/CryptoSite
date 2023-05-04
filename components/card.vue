<script setup lang="ts">
import { useStateStore } from '~~/store/state'
import { itemPaletteMode } from '~~/types/enums'
import ItemPrivate from '~~/types/itemPrivate'
import ItemPublic from '~~/types/itemPublic'

const props = defineProps<{
  item: ItemPrivate | ItemPublic
  mode: itemPaletteMode
}>()

const state = useStateStore()
const currency = state.getCurrency()

function view() {
  if (props.mode === itemPaletteMode.inGeneral) {
  }
}
</script>

<template>
  <div class="card border-0 w-100" @click="view">
    <img
      :src="`https://ipfs.io/ipfs/${item.imageCID}`"
      class="card-img-top"
      :alt="`Image of ${item.name}`"
    />
    <div class="card-body">
      <h5 class="card-title">
        <p class="text-truncate">{{ item.name }}</p>
        <p class="badge bg-success">${{ item.price }}</p>
      </h5>
      <p class="card-text text-muted">
        {{
          `${item.tag[1].name}${
            item.tag[2].name ? `, ${item.tag[2].name}...` : `...`
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
