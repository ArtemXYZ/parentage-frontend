<!-- pages/places.vue -->
<script setup>

const PageName = 'Места'

definePageMeta({
  layout: 'tree-layout',
  title: PageName,
  icon: 'ph:globe',
  order: 6
})
</script>

<template>
  <div class="page-content">
    <h1>{{PageName}}</h1>
  </div>
</template>


<style scoped>
</style>
