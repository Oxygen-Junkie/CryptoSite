<script setup lang="ts">
const props = defineProps<{
  image01: string
  image02: string
  image03: string
}>()
</script>

<template>
  <div id="carousel" class="m-1 w-full rounded-b">
    <div
      id="carouselExampleControls"
      class="carousel slide"
      data-bs-ride="carousel"
    >
      <div class="carousel-inner">
        <div class="carousel-item active">
          <img
            :src="props.image01"
            class="block w-full carousel-image"
            alt="..."
          />
        </div>
        <div class="carousel-item">
          <img
            :src="props.image02"
            class="block w-full carousel-image"
            alt="..."
          />
        </div>
        <div class="carousel-item">
          <img
            :src="props.image03"
            class="block w-full carousel-image"
            alt="..."
          />
        </div>
      </div>
      <button
        class="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleControls"
        data-bs-slide="prev"
      >
        <span class="carousel-control-prev-icon" aria-hidden="true" />
        <span class="visually-hidden">Previous</span>
      </button>
      <button
        class="carousel-control-next"
        type="button"
        data-bs-target="#carouselExampleControls"
        data-bs-slide="next"
      >
        <span class="carousel-control-next-icon" aria-hidden="true" />
        <span class="visually-hidden">Next</span>
      </button>
    </div>
  </div>
</template>

<style>
.carousel-image {
  height: 300px;
  object-fit: cover;
}
</style>
