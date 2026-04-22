<!-- pages/data.vue -->
<script setup>

const PageName = 'Данные'

definePageMeta({
  layout: 'tree-layout',
  title: PageName,
  icon: 'ph:database',
  order: 3
})
</script>

<template>
  <div class="page-content">
    <h1>{{PageName}}</h1>
  </div>
</template>


<style scoped>
</style>
