<script>
import Container from '@/components/Container.vue'
import Modal from '@/components/Modal.vue'

export default {
  name: 'Home',
  components: {
    Container,
    Modal,
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
    this.loadProducts()
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
}
</script>

<template setup lang="ts">
  <div class="container mx-auto mb-3" id="home">
    <Container>
      <h1><ion-icon name="download-outline"></ion-icon> Сделки на покупку</h1>
      <Container>
        <h4>
          <ion-icon name="chevron-forward-outline"></ion-icon>&nbsp; Запрос на
          покупку товара Дрель в колличестве 1 шт.
        </h4>
        <h6>Сделка ожидает подтверждения</h6>
        <p class="card-text text-muted">Стоимость за заказ 700 руб.</p>
        <button type="button" class="btn rounded btn-danger w-50" data-bs-toggle="modal"
        data-bs-target="#exampleModal" >
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
