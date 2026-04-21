<!-- components/widgets/trees/RadialGraph.vue -->
<template>
  <div class="radial-tree" ref="containerRef"></div>
</template>

<script setup>
import * as d3 from 'd3'
import { NodeClickHandler } from '~/utils/NodeClickHandler'
import { hierarchyData } from '~/mocks/familyData'

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

  node.append('circle')
    .attr('r', 5)
    .attr('fill', d => {
      if (d.data.gender === 'male') return '#4a90e2'
      if (d.data.gender === 'female') return '#e24a4a'
      return d.children ? '#ff9a3c' : '#8b8b8b'
    })
    .attr('stroke', '#fff')
    .attr('stroke-width', 2)

  node.append('text')
    .attr('dy', '0.31em')
    .attr('dx', d => d.x < 180 ? 10 : -10)
    .attr('text-anchor', d => d.x < 180 ? 'start' : 'end')
    .attr('transform', d => d.x < 180 ? null : 'rotate(180)')
    .style('font-size', '11px')
    .style('fill', '#333')
    .style('pointer-events', 'none')
    .text(d => d.data.name)

  node.append('title').text(d => d.data.birthYear ? `${d.data.name}\n${d.data.birthYear}` : d.data.name)
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