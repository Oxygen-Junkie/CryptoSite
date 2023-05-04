<script setup lang="ts"></script>

<template>
  <div id="nav" class="sticky-top text-center">
    <nav>
      <router-link to="/">
        <ion-icon name="home-outline" />&nbsp; Товар
      </router-link>
      <router-link to="/">
        <ion-icon name="home-outline" />&nbsp; Сделки
      </router-link>
      <router-link to="/login">
        <ion-icon name="log-in-outline" />&nbsp; Выставленное
      </router-link>
    </nav>
  </div>
</template>

<style scoped>
nav {
  background-color: #eb2121;
  padding: 1%;
}

nav ion-icon,
a {
  color: white;
  font-size: 20pt;
  padding-inline: 1%;
}
</style>
