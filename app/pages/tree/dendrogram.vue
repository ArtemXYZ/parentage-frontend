<!-- pages/tree/dendrogram.vue -->
<template>

  <TreeCanvas ref="canvasRef">

    <DendrogramGraph />

  </TreeCanvas>

</template>

<script setup>
definePageMeta({
  layout: 'tree-layout',  
  title: 'Дендрограмма'
})
</script>