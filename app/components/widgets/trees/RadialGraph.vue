<!-- components/widgets/trees/RadialGraph.vue -->
<template>
  <div class="radial-tree" ref="containerRef"></div>
</template>

<script setup>
import * as d3 from 'd3'
import { NodeClickHandler } from '~/utils/NodeClickHandler'
import { hierarchyData } from '~/mocks/familyData'

// Внутри script setup
const cleanup = () => {
  const zoomGroup = findZoomGroup()
  if (zoomGroup) {
    d3.select(zoomGroup).selectAll('.dendrogram-content').remove()
  }
}

onUnmounted(() => {
  cleanup()
})


const props = defineProps({
  customData: { type: Object, default: null },
  radius: { type: Number, default: 450 },
  margin: { type: Number, default: 40 }
})

const containerRef = ref(null)
const tabsManager = inject('tabsManager')
const openEditor = inject('openEditor')
const clickHandler = new NodeClickHandler(tabsManager, openEditor)

const getData = () => props.customData || hierarchyData

const findZoomGroup = () => {
  if (!containerRef.value) return null
  const svg = containerRef.value.closest('.tree-canvas')?.querySelector('svg')
  return svg?.querySelector('g')
}

const renderGraph = () => {
  const zoomGroup = findZoomGroup()
  if (!zoomGroup) return setTimeout(renderGraph, 100)

  d3.select(zoomGroup).selectAll('.radial-content').remove()

  const container = containerRef.value.closest('.tree-canvas')
  if (!container) return

  const width = container.clientWidth
  const height = container.clientHeight
  const currentRadius = Math.min(width, height) / 2 - props.margin

  const rootData = getData()
  const root = d3.hierarchy(rootData)
  const treeLayout = d3.tree()
    .size([360, currentRadius])
    .separation((a, b) => (a.parent === b.parent ? 1 : 2) / a.depth)
  treeLayout(root)

  const graphGroup = d3.select(zoomGroup)
    .append('g')
    .attr('class', 'radial-content')
    .attr('transform', `translate(${width / 2}, ${height / 2})`)

  const radialDiagonal = d3.linkRadial()
    .angle(d => d.x * Math.PI / 180)
    .radius(d => d.y)

  graphGroup.selectAll('.link')
    .data(root.links())
    .enter()
    .append('path')
    .attr('class', 'link')
    .attr('d', radialDiagonal)
    .attr('fill', 'none')
    .attr('stroke', '#ccc')
    .attr('stroke-width', 1.5)

  const node = graphGroup.selectAll('.node')
    .data(root.descendants())
    .enter()
    .append('g')
    .attr('class', 'node')
    .attr('transform', d => `rotate(${d.x - 90}) translate(${d.y}, 0)`)
    .style('cursor', 'pointer')
    .on('click', (event, d) => {
      event.stopPropagation()
      clickHandler.handleSingleClick(d.data)
    })
    .on('dblclick', (event, d) => {
      event.stopPropagation()
      clickHandler.handleDoubleClick(d.data)
    })

  // кружок узла
  node.append('circle')
    .attr('r', 6)
    .attr('fill', d => {
      if (d.data.gender === 'male') return '#4a90e2'
      if (d.data.gender === 'female') return '#e24a4a'
      return d.children ? '#ff9a3c' : '#8b8b8b'
    })
    .attr('stroke', '#fff')
    .attr('stroke-width', 2)

  // Горизонтальная подпись с полупрозрачным фоном
  node.each(function(d) {
    const nodeGroup = d3.select(this)
    const angle = d.x // 0..360

    // Группа, компенсирующая поворот узла — чтобы текст всегда был горизонтальным
    const labelGroup = nodeGroup.append('g')
      .attr('transform', `rotate(${-(angle - 90)})`)

    // Текст
    const text = labelGroup.append('text')
      .attr('dy', '0.35em')
      .attr('dx', angle < 180 ? 25 : -25)           // отступ от узла
      .attr('text-anchor', angle < 180 ? 'start' : 'end')
      .style('font-size', '12px')
      .style('font-weight', '500')
      .style('fill', '#1e293b')
      .style('pointer-events', 'none')
      .text(d.data.name)

    // Фон (прямоугольник позади текста)
    const bbox = text.node().getBBox()
    labelGroup.insert('rect', 'text')
      .attr('x', bbox.x - 4)
      .attr('y', bbox.y - 1)
      .attr('width', bbox.width + 12)
      .attr('height', bbox.height + 4)
      .attr('fill', 'rgba(255, 255, 255, 0.85)')
      .attr('rx', 4)
      .attr('ry', 4)
      .style('pointer-events', 'none')
  })

  // тултип (опционально)
  node.append('title')
    .text(d => d.data.birthYear ? `${d.data.name}\n${d.data.birthYear}` : d.data.name)
}

watchEffect(() => {
  if (containerRef.value) {
    const zg = findZoomGroup()
    if (zg) renderGraph()
    else {
      const observer = new MutationObserver(() => {
        const zg = findZoomGroup()
        if (zg) { observer.disconnect(); renderGraph() }
      })
      observer.observe(containerRef.value.closest('.tree-canvas') || document.body, {
        childList: true, subtree: true
      })
    }
  }
})

watch(() => props.customData, renderGraph, { deep: true })

let resizeObserver
onMounted(() => {
  const container = containerRef.value?.closest('.tree-canvas')
  if (container && window.ResizeObserver) {
    resizeObserver = new ResizeObserver(renderGraph)
    resizeObserver.observe(container)
  }
})
onUnmounted(() => resizeObserver?.disconnect())
</script>

<style scoped>
.radial-tree {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
</style>