<script setup lang="ts">

</script>

<script>

</script>

<template>
  <div id="home" class="container mx-auto mb-3">
    <img src="https://source.unsplash.com/800x300/?Japan" class="w-100">
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
            <input placeholder="Имеет в названии....">
          </div>
          <div class="col-md">
            <lottie-player
              src="https://assets7.lottiefiles.com/packages/lf20_3vbOcw.json"
              background="transparent"
              speed="1"
              style="width = ref(300px; height = ref(300px"
              loop
              autoplay
            />
          </div>
        </div>
      </div>
    </Container>
    <div class="row">
      <div v-if="user !== 'Visitante'" class="col-md">
        <router-link to="/profile" class="text-decoration-none text-black">
          <Container class="text-center p-5">
            <h2><ion-icon name="cube-outline" /> Pedidos</h2>
            <img
              src="https://www.pngall.com/wp-content/uploads/5/Cardboard-Box-PNG-Image.png"
              alt="Caixa de pedidos"
              class="block-image"
            >
          </Container>
        </router-link>
      </div>
      <div v-if="user !== 'Visitante'" class="col-md">
        <router-link to="/admin" class="text-decoration-none text-black">
          <Container class="text-center p-5">
            <h2><ion-icon name="cog-outline" /> Gerenciar</h2>
            <img
              src="https://image.freepik.com/vetores-gratis/ilustracao-de-um-roda-dentada_53876-6328.jpg"
              alt="Gerenciar"
              class="block-image"
            >
          </Container>
        </router-link>
      </div>
    </div>
    <Container>
      <h1><ion-icon name="apps-outline" /> Категории</h1>
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
                    `http://127.0.0.1:8000/api/laravel/products/tag/${tag.id}`,
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
        <ion-icon name="balloon-outline" /> Товары ({{
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
