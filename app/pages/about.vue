<script setup>
definePageMeta({
  title: 'О нас',  // Кастомное название для меню
  order: 2         // Опционально: порядок в меню
})
</script>

<template>
  <div class="layout-container">
    <NuxtLayout>  <!-- Всё, что здесь, попадёт в <slot /> лейаута -->
      
      <Header />
      <Main />
      <Footer />
      
    </NuxtLayout>
  </div>
</template>


<style scoped>
.layout-container {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
}
</style>
