<template>
  <div ref="canvasRef" class="tree-canvas">
    <svg ref="svgRef" width="100%" height="100%">
      <g ref="zoomGroup">
        <slot />
      </g>
    </svg>
  </div>
</template>

<script setup>
// Импорты d3 ОБЯЗАТЕЛЬНЫ
import * as d3 from 'd3'

const canvasRef = ref(null)
const svgRef = ref(null)
const zoomGroup = ref(null)

let zoomBehavior = null

onMounted(() => {
  if (!svgRef.value) return
  
  const svg = d3.select(svgRef.value)
  zoomBehavior = d3.zoom()
    .scaleExtent([0.1, 10])
    .on('zoom', (event) => {
      if (zoomGroup.value) {
        d3.select(zoomGroup.value).attr('transform', event.transform)
      }
    })
  svg.call(zoomBehavior)
})

function resetZoom() {
  if (!svgRef.value || !zoomBehavior) return
  const svg = d3.select(svgRef.value)
  svg.transition().duration(750).call(zoomBehavior.transform, d3.zoomIdentity)
}

defineExpose({ resetZoom })
</script>

<style scoped>
.tree-canvas {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #fafafa;
  position: relative;
}
svg {
  display: block;
  width: 100%;
  height: 100%;
}
</style>