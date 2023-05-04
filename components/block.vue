<script setup lang="ts">
const props = defineProps<{ name: string }>()
const link = computed(
  () => `https://source.unsplash.com/200x200/?${props.name}`
)
</script>

<template>
  <div
    id="block"
    class="rounded text-center m-1"
    :style="{
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.527),rgba(0, 0, 0, 0.5)) ,url(${link})`,
    }"
  >
    <span />
    <h3 class="text-white">
      {{ props.name }}
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
