<!-- pages/about.vue -->
<script setup>

const PageName = 'О нас'

definePageMeta({
  layout: 'tree-layout',
  title: PageName,
  icon: 'ph:info',
  order: 2
})
</script>

<template>
  <div class="page-content">
    <h1>{{PageName}}</h1>
  </div>
</template>


<style scoped>
</style>
