<!-- pages/tree/dendrogram.vue -->
<template>

  <TreeCanvas ref="canvas">

    <RadialGraph  />  // :custom-data="familyData"

  </TreeCanvas>

</template>

<script setup>


definePageMeta({
  layout: 'tree-layout',   
  title: 'Радиальный граф'
})
</script>