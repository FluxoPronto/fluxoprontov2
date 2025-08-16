<template>
  <NuxtLayout data-theme="dark">
    <NuxtPage />
  </NuxtLayout>
  
  <!-- Plano de fundo decorativo opcional (CSS controla visibilidade/tema) -->
  <div class="bg-decor" aria-hidden="true"></div>
</template>

<script setup>
import '~/assets/css/main.css';

useHead({
  link: [
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Material+Icons' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Material+Icons+Outlined' }
  ],
  htmlAttrs: { lang: 'pt-BR' },
  bodyAttrs: { class: 'ds-root' },
})
</script>

<style>
/* Estilos mínimos locais, todo o resto está em assets/css/main.css */
.bg-decor { display: none; }
@media (min-width: 1024px) {
  .bg-decor {
    display: block;
    position: fixed;
    inset: 0 auto auto 0;
    width: 50vw;
    height: 50vh;
    pointer-events: none;
    background: radial-gradient(600px at 0% 0%, rgba(129,140,248,.20), transparent 60%);
    z-index: 0;
  }
}
</style>