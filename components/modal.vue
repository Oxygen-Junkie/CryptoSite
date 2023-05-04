<script setup lang="ts">
const emit = defineEmits<{
  (refresh: boolean): void
}>()
emit(true)
</script>

<template>
  <div
    id="exampleModal"
    class="modal fade"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 id="exampleModalLabel" class="modal-title">
            Cadastrar novo produto
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>
        <div class="modal-body">
          <form id="form" @submit.prevent="SendData">
            <label for="name"
              ><ion-icon name="text-outline" /> Nome do produto</label
            >
            <input
              id="name"
              v-model="name"
              type="text"
              class="form-control"
              required
            />
            <br />
            <div class="row">
              <div class="col-md-8">
                <label for="image"
                  ><ion-icon name="image-outline" /> Imagem do produto</label
                >
                <input
                  id="image"
                  v-model="image"
                  type="text"
                  class="form-control"
                  required
                />
              </div>
              <div class="col-md-4">
                <img
                  :src="
                    image ||
                    'https://www.signfix.com.au/wp-content/uploads/2017/09/placeholder-600x400.png'
                  "
                  alt="Imagem"
                  class="image rounded"
                />
              </div>
            </div>
            <br />
            <label for="price"
              ><ion-icon name="pricetags-outline" /> Preço</label
            >
            <input
              id="price"
              v-model="price"
              type="number"
              min="0"
              step="0.01"
              class="form-control"
            />
            <br />
            <label for="tag"
              ><ion-icon name="pricetag-outline" /> Categoria do produto</label
            >
            <select id="tag" class="form-select" @change="selected($event)">
              <option v-for="tag in tags" :key="tag.id" :value="tag.id">
                {{ tag.name }}
              </option>
            </select>
            <br />
            <label
              ><ion-icon name="fast-food-outline" /> O produto é
              perecível?</label
            >
            <div class="form-check">
              <input
                id="opt1"
                v-model="perishable"
                type="radio"
                value="0"
                name="perishable"
                class="form-check-input"
              />
              <label for="opt1" class="form-check-label">Não</label>
              <br />
              <input
                id="opt2"
                v-model="perishable"
                type="radio"
                value="1"
                name="perishable"
                class="form-check-input"
              />
              <label for="opt2" class="form-check-label">Sim</label>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Fechar
          </button>
          <button
            type="submit"
            class="btn btn-success"
            data-bs-dismiss="modal"
            @click="SendForm"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.image {
  width: 100px;
  height: 100px;
  object-fit: cover;
}
</style>
