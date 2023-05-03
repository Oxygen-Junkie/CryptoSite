<script setup lang="ts">
import { useStateStore } from '../store/state'
navigateTo('/')

const store = useStateStore()
</script>

<template>
  <deal_palette />
  <div id="home" class="container mx-auto mb-3">
    <Container>
      <h1><ion-icon name="download-outline" /> Сделки на покупку</h1>
      <Container>
        <h4>
          <ion-icon name="chevron-forward-outline" />&nbsp; Запрос на
          покупку товара Дрель в количестве 1 шт.
        </h4>
        <h6>Сделка ожидает подтверждения</h6>
        <p class="card-text text-muted">
          Стоимость за заказ 700 руб.
        </p>
        <button
          type="button" class="btn rounded btn-danger w-50" data-bs-toggle="modal"
          data-bs-target="#exampleModal"
        >
          Отменить сделку
        </button>
      </Container>
    </Container>
    <Modal
      @refresh="loadProducts()"
    />
  </div>
</template>

<style scoped>
.wrapper {
  display: flex;
  overflow-x: auto;
  padding: 3%;
}

.block-image {
  width: 200px;
  height: 200px;
  object-fit: cover;
}

.bg-red {
  background-color: red;
}
</style>
