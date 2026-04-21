<!-- pages/tree/dendrogram.vue -->
<template>

  <TreeCanvas ref="canvas">

    <ForceGraph />

  </TreeCanvas>

</template>

<script setup>
definePageMeta({
  layout: 'tree-layout',  
  title: 'Направленный силовой граф'
})
</script>