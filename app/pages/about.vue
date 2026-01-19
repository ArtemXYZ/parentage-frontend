<script setup>
definePageMeta({
  layout: 'default',  
  title: 'О нас',  // Кастомное название для меню
  order: 2         // Опционально: порядок в меню
})
</script>

<template>
  <div class="page-content">
    <h1>Страница о нас</h1>
  </div>
</template>


<style scoped>
.page-content {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
}
</style>
