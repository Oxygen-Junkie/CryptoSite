<template>
  <div id="home" class="container mx-auto mb-3">
    <img src="https://source.unsplash.com/800x300/?Japan" class="w-100" />
    <Container>
      <div v-if="userLoaded === false" class="loading">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      <div v-show="userLoaded" class="loaded">
        <div class="row">
          <div class="col-md p-5">
            <h1>Здравствуйте! 👋</h1>
            <p>С чем вы хотели бы ознакомиться сегодня?</p>
            <input placeholder="Имеет в названии...." />
          </div>
          <div class="col-md">
            <lottie-player
              src="https://assets7.lottiefiles.com/packages/lf20_3vbOcw.json"
              background="transparent"
              speed="1"
              style="width: 300px; height: 300px"
              loop
              autoplay
            ></lottie-player>
          </div>
        </div>
      </div>
    </Container>
    <div class="row">
      <div v-if="user !== 'Visitante'" class="col-md">
        <router-link to="/profile" class="text-decoration-none text-black">
          <Container class="text-center p-5">
            <h2><ion-icon name="cube-outline"></ion-icon> Pedidos</h2>
            <img
              src="https://www.pngall.com/wp-content/uploads/5/Cardboard-Box-PNG-Image.png"
              alt="Caixa de pedidos"
              class="block-image"
            />
          </Container>
        </router-link>
      </div>
      <div v-if="user !== 'Visitante'" class="col-md">
        <router-link to="/admin" class="text-decoration-none text-black">
          <Container class="text-center p-5">
            <h2><ion-icon name="cog-outline"></ion-icon> Gerenciar</h2>
            <img
              src="https://image.freepik.com/vetores-gratis/ilustracao-de-um-roda-dentada_53876-6328.jpg"
              alt="Gerenciar"
              class="block-image"
            />
          </Container>
        </router-link>
      </div>
    </div>
    <Container>
      <h1><ion-icon name="apps-outline"></ion-icon> Категории</h1>
      <div v-if="tagLoaded === false" class="loading">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      <div v-show="tagLoaded" class="loaded">
        <div class="row">
          <div class="wrapper">
            <div v-for="tag in tags" :key="tag.id" class="col">
              <Block
                :name="tag.name"
                @click="
                  loadProducts(
                    `http://127.0.0.1:8000/api/laravel/products/tag/${tag.id}`
                  )
                "
              />
            </div>
          </div>
        </div>
      </div>
    </Container>
    <Container>
      <h1>
        <ion-icon name="balloon-outline"></ion-icon> Товары ({{
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
                  >Página anterior</a
                >
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
                  >{{ pages.current_page + 1 }}</a
                >
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
                  >{{ pages.current_page + 2 }}</a
                >
              </li>
              <li class="page-item">
                <a
                  class="page-link"
                  @click="loadProducts(`${pages.last_page_url}`)"
                  >Última página</a
                >
              </li>
            </ul>
          </nav>
        </div>
        <p v-if="products.length < 1">Não há produtos para listar.</p>
      </div>
    </Container>
  </div>
</template>

<script>
import Container from '@/components/Container.vue'
import Block from '@/components/Block.vue'
import Card from '@/components/Card.vue'

export default {
  name: 'Home',
  components: {
    Container,
    Block,
    Card,
  },
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
  mounted() {
    this.LoadUser()
    this.loadCategories()
    this.loadProducts()
  },
  methods: {
    async loadCategories() {
      //      const pass = "laravel";//
      //      const url = `http://127.0.0.1:8000/api/${pass}/tags`;

      //      fetch(url)
      //        .then((response) => response.json())
      //        .then((response) => {
      this.tags = [
        {
          id: '1',
          name: 'Инструменты',
        },
        {
          id: '2',
          name: 'Процессоры',
        },
      ]
      this.tagLoaded = true
      //        });
    },
    async loadProducts() {
      //      fetch(url)
      //        .then((response) => response.json())
      //        .then((response) => {
      //          this.pages = response;
      this.products = [
        {
          id: '1',
          image: 'Дрель.jpg',
          name: 'Дрель',
          price: '700',
          perishable: 'product.perishable',
          tag: 'product.tag',
        },
        {
          id: '2',
          image: 'i9.jpg',
          name: 'Intel Core i9',
          price: '10000',
          perishable: 'product.perishable',
          tag: 'product.tag',
        },
      ]

      this.producstsLoaded = true
      //        });
    },
    LoadUser() {
      const token = localStorage.getItem('token')

      if (token !== null) {
        const url = 'http://127.0.0.1:8000/api/user'

        fetch(url, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => response.json())
          .then((response) => {
            this.user = response.name
            this.userLoaded = true
          })
      } else {
        this.userLoaded = true
      }
    },
  },
}
</script>

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
</style>
