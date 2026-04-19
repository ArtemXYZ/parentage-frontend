<!-- components/widgets/backgrounds/trees/TreeCanvas.vue -->
<script setup>
import * as d3 from 'd3'

const canvasRef = ref(null)
const svgRef = ref(null)
const zoomGroup = ref(null)

const zoom = ref(1)
const gridSize = computed(() => {
  if (zoom.value < 0.5) return 40
  if (zoom.value < 1) return 30
  if (zoom.value < 2) return 20
  return 15
})
const dotSize = computed(() => {
  if (zoom.value < 0.5) return 2
  if (zoom.value < 1) return 1.5
  if (zoom.value < 2) return 1
  return 0.8
})

let zoomBehavior = null

onMounted(() => {
  if (!svgRef.value || !zoomGroup.value) return
  const svg = d3.select(svgRef.value)
  zoomBehavior = d3.zoom()
    .scaleExtent([0.2, 4])
    .filter((event) => event.type === 'wheel' || event.ctrlKey)
    .on('zoom', (event) => {
      d3.select(zoomGroup.value).attr('transform', event.transform)
      zoom.value = event.transform.k
    })
  svg.call(zoomBehavior)
})

const zoomIn = () => {
  if (!svgRef.value) return
  d3.select(svgRef.value).transition().duration(300).call(zoomBehavior.scaleBy, 1.3)
}
const zoomOut = () => {
  if (!svgRef.value) return
  d3.select(svgRef.value).transition().duration(300).call(zoomBehavior.scaleBy, 0.7)
}
const resetZoom = () => {
  if (!svgRef.value) return
  d3.select(svgRef.value).transition().duration(300).call(zoomBehavior.transform, d3.zoomIdentity)
}

defineExpose({ zoomGroup, svgRef, canvasRef })
</script>

<template>
  <div ref="canvasRef" class="tree-canvas">
    <svg ref="svgRef" width="100%" height="100%">
      <defs>
        <pattern id="dotGrid" :width="gridSize" :height="gridSize" patternUnits="userSpaceOnUse">
          <circle :cx="gridSize/2" :cy="gridSize/2" :r="dotSize" fill="#cbd5e1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dotGrid)" />
      <g ref="zoomGroup">
        <slot />
      </g>
    </svg>
    <div class="zoom-controls">
      <button @click="zoomIn" class="zoom-btn" title="Приблизить">+</button>
      <button @click="zoomOut" class="zoom-btn" title="Отдалить">−</button>
      <button @click="resetZoom" class="zoom-btn" title="Сбросить">⌂</button>
    </div>
  </div>
</template>

<style scoped>
.tree-canvas {
  width: 100%;
  height: 100%;
  position: relative;
  background: transparent;
}
svg {
  display: block;
  width: 100%;
  height: 100%;
}
.zoom-controls {
  position: absolute;
  bottom: 20px;
  left: 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(4px);
  padding: 6px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #dee2e6;
}
.zoom-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: none;
  border-radius: 6px;
  font-size: 18px;
  font-weight: 500;
  color: #495057;
  cursor: pointer;
  transition: all 0.2s;
}
.zoom-btn:hover {
  background: #f8f9fa;
  color: #212529;
}
</style>