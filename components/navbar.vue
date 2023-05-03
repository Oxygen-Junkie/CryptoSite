<script setup lang="ts">
</script>

<template>
  <div id="nav" class="sticky-top text-center">
    <OffCanvas :cart="cart" />
    <nav>
      <router-link to="/">
        <img
          src="/img/logo.png"
          alt="Logo"
          style="width: 50px; clip-path: circle()"
        >
      </router-link>
      <router-link to="/">
        <ion-icon name="home-outline" />
      </router-link>
      <router-link v-if="auth === false" to="/login">
        <ion-icon name="log-in-outline" />
      </router-link>
      <a
        v-show="auth"
        data-bs-toggle="offcanvas"
        href="#offcanvasExample"
        role="button"
        aria-controls="offcanvasExample"
        @click="UpdateCanvas"
      >
        <ion-icon name="cart-outline" />
      </a>
      <router-link v-show="auth" to="/profile">
        <ion-icon name="person-circle-outline" />
      </router-link>
      <a v-show="auth" href="/" @click="Logout"><ion-icon name="log-out-outline" /></a>
    </nav>
  </div>
</template>

<style scoped>
nav {
  background-color: #e070a5;
  padding: 1%;
}

nav ion-icon,
a {
  color: white;
  font-size: 20pt;
  padding-inline: 1%;
}
</style>
