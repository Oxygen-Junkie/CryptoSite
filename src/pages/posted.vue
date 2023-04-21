<script setup lang="ts">
import Container from '@/components/Container.vue'
import Card from '@/components/Card.vue'
navigateTo('/')

export default {
  name: 'Home',
  props: ['key'],
  data() {
    return {
      user: 'Visitante',
      tags: [],
      products: [],
      pages: [],
      tagLoaded: false,
      userLoaded: false,
      producstsLoaded: false,
    }
  },
  components: {
    Container,
    Card,
  },
  methods: {
    async loadProducts() {
      this.products = [
        {
          id: '1',
          image: 'Кувалда.jpg',
          name: 'Кувалда',
          price: '500',
          perishable: 'product.perishable',
          tag: 'product.tag',
        },
      ]
      this.producstsLoaded = true
    },
    LoadUser() {
      const token = localStorage.getItem('token')

      if (token !== null) {
        const url = 'http://127.0.0.1:8000/api/user'

        fetch(url, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        })
          .then(response => response.json())
          .then((response) => {
            this.user = response.name
            this.userLoaded = true
          })
      }
      else {
        this.userLoaded = true
      }
    },
  },
  mounted() {
    this.loadProducts()
  },
}
</script>

<template>
  <div id="home" class="container mx-auto mb-3">
    <Container>
      <h1><ion-icon name="alert-outline" /> Сделки на продажу</h1>
      <div v-if="tagLoaded === false" class="loading">
        <div class="bg-red shadow p-1 mt-1 rounded w-100">
          <div class="row">
            <div v-for="product in products" :key="product.id" class="col-md-3">
              <Card
                :id="product.id"
                :image="product.image"
                :name="product.name"
                :price="product.price"
                :perishable="product.perishable"
                :tag="product.tag"
              />
            </div>
          </div>
          <Container>
            <h4><ion-icon name="send-outline" />&nbsp; Запрос на продажу в количестве 10 шт.</h4>
            <p class="card-text text-muted">
              Место <input type="text" class="w-50" placeholder="проспект Столыпина, дом 1, квартира 9"> &nbsp; Время <input type="text" placeholder="Пн-Пт с 9:00 до 18:00">
            </p>
            <button type="button" class="btn rounded btn-danger w-50">
              Согласиться на продажу
            </button>
          </Container>
          <Container>
            <h4><ion-icon name="cash-outline" />&nbsp; Активная сделка на продажу в количестве 10 шт.</h4>
            Код:<span class="text-danger">
              412178
            </span>
          </Container>
        </div>
      </div>
    </Container>
    <Container>
      <h1>
        <ion-icon name="document-attach-outline" /> Установить новое объявление о продаже товара
      </h1>
      <button type="button" class="btn rounded btn-primary m-3 p-3 w-100">
        + Разместить новый товар
      </button>
    </Container>

    <Container>
      <h1>
        <ion-icon name="attach-outline" /> Выставленные вами товары ({{
          products.length
        }})
      </h1>
      <div v-if="producstsLoaded === false" class="loading">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      <div v-show="producstsLoaded">
        <div class="row">
          <div v-for="product in products" :key="product.id" class="col-md-3">
            <Card
              :id="product.id"
              :image="product.image"
              :name="product.name"
              :price="product.price"
              :perishable="product.perishable"
              :tag="product.tag"
            />
          </div>
        </div>
        <div v-if="pages.per_page < pages.total" class="container text-center">
          <nav>
            <ul class="pagination">
              <li class="page-item">
                <a
                  class="page-link"
                  @click="loadProducts(`${pages.links[0].url}`)"
                >Página anterior</a>
              </li>
              <li class="page-item active">
                <a class="page-link">{{ pages.current_page }}</a>
              </li>
              <li
                v-if="pages.current_page + 1 <= pages.last_page"
                class="page-item"
              >
                <a
                  class="page-link"
                  @click="loadProducts(pages.next_page_url)"
                >{{ pages.current_page + 1 }}</a>
              </li>
              <li
                v-if="pages.current_page + 2 <= pages.last_page"
                class="page-item"
              >
                <a
                  class="page-link"
                  @click="
                    loadProducts(`${pages.links[pages.current_page + 2].url}`)
                  "
                >{{ pages.current_page + 2 }}</a>
              </li>
              <li class="page-item">
                <a
                  class="page-link"
                  @click="loadProducts(`${pages.last_page_url}`)"
                >Última página</a>
              </li>
            </ul>
          </nav>
        </div>
        <p v-if="products.length < 1">
          Não há produtos para listar.
        </p>
      </div>
    </Container>
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
