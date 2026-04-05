<script setup>
const pageName = 'Древо'

definePageMeta({
  layout: 'default',  
  title: pageName,
  order: 3
})
</script>

<template>
  <div class="page-content">
    <div class="title-section">
      <h1>{{ pageName }}</h1>
      <p class="subtitle">Визуализация семейного древа</p>
    </div>

    <!-- Виджет графа -->
    <FoceDirectedGraph 
      :width="960"
      :height="600"
      :node-radius="6"
      :charge-force="-80"
    />
  </div>
</template>


<style scoped>
.page-content {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.title-section {
  margin-bottom: 24px;
}

.title-section h1 {
  font-size: 28px;
  color: #2c3e50;
  margin-bottom: 8px;
}

.subtitle {
  color: #7f8c8d;
  font-size: 14px;
}
</style>