<script setup lang="ts">
import Tag from '~~/types/tag'

const props = defineProps<{ tag: Tag }>()
</script>

<template>
  <div
    id="block"
    class="rounded text-center m-1"
    :style="{
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.527),rgba(0, 0, 0, 0.5)) ,url(${props.tag.imageURL})`,
    }"
  >
    <span />
    <h3 class="text-white">
      {{ props.tag.name }}
    </h3>
    <span />
  </div>
</template>

<style scoped>
#block {
  width: 200px;
  height: 200px;
  display: grid;
  grid-template-rows: repeat(3, 1fr);
}

#block:hover {
  transform: scale(1.05);
  cursor: pointer;
}
</style>
