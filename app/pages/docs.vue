<!-- pages/docs.vue -->
<script setup>

const PageName = 'Документы'

definePageMeta({
  layout: 'tree-layout',
  title: PageName,
  icon: 'ph:files',
  order: 4
})
</script>

<template>
  <div class="page-content">
    <h1>{{PageName}}</h1>

    1. Все диаграммы перемещаем на бекграунд слой. 
    2. навигатор и сайдбар - должны сворачиваться и в некоторых местах менять размер (растягиваться выдвигаться пользователем).
    3. сделать древовидную ирархию ссылок в навигаторе
    4. сделать верхний навигатор.
    5. Форма под данные персоны в сайдбар перенести.


  </div>
</template>


<style scoped>
</style>
