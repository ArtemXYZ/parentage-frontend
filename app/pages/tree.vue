<!-- pages/tree.vue -->
<template>
  <TreeCanvas ref="canvasRef">
    <component :is="graphComponent" />
  </TreeCanvas>
</template>

<script setup>
import DendrogramGraph from '~/components/widgets/trees/DendrogramGraph.vue'
import RadialGraph from '~/components/widgets/trees/RadialGraph.vue'
import ForceGraph from '~/components/widgets/trees/ForceGraph.vue'

definePageMeta({
  layout: 'tree-layout',
  title: 'Древо'
})

const graphType = inject('graphType')
const graphComponent = computed(() => {
  switch (graphType?.value) {
    case 'radial': return RadialGraph
    case 'force': return ForceGraph
    default: return DendrogramGraph
  }
})
</script>