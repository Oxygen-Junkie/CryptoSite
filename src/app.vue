<script lang="ts" setup>
import { InitApp } from '~/utils/initApp'
InitApp()
const locale = useState<string>('locale.i18n')
</script>

<template>
  <Html :lang="locale">
    <Body>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </Body>
  </Html>
</template>

<style lang="postcss">
body {
  background-color: rgb(226, 226, 226);
}

* {
  padding: 0;
  margin: 0;
  font-family: "Oxygen", sans-serif;
}
body {
  background-color: rgb(226, 226, 226);
}
/* Scrollbar */
/* width */
::-webkit-scrollbar {
  width: 10px;
}
/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
}
/* Handle */
::-webkit-scrollbar-thumb {
  background: #bbbbbb;
  border-radius: 10px;
}
/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
.btn-success {
  background-color: #27bd90;
  border: 0;
}
.btn-success:hover {
  background-color: #299c7a;
}
</style>
