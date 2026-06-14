<script setup>

const PageName = 'index'

definePageMeta({
  layout: 'tree-layout',
  title: PageName,
  icon: 'ph:globe',
  order: 1
})


</script>

<template>
  <div class="page-content">

    <!-- СЛОТ ЗАГОЛОВКА -->
    <div name="title">
        <h1>Добро пожаловать в Parentage</h1>
    </div>

    <!-- СЛОТ КОНТЕНТА -->
    <div name="content">
        <h1>{{PageName}}</h1>
    </div>

  </div>
</template>


<style scoped>
</style>
