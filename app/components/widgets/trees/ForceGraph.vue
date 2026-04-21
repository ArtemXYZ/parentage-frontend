<!-- components/widgets/trees/ForceGraph.vue -->
<template>
  <div class="force-graph" ref="containerRef"></div>
</template>

<script setup>
import * as d3 from 'd3'
import { NodeClickHandler } from '~/utils/NodeClickHandler'
import { familyTreeData } from '~/mocks/familyData'

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
  nodeRadius: { type: Number, default: 5 },
  chargeForce: { type: Number, default: -60 }
})

const containerRef = ref(null)
let simulation = null

const tabsManager = inject('tabsManager')
const openEditor = inject('openEditor')
const clickHandler = new NodeClickHandler(tabsManager, openEditor)

// Построение nodes/links из familyTreeData
const buildForceData = (treeData) => {
  const nodes = []
  const links = []
  const idMap = new Map()

  const traverse = (node, parentId = null) => {
    if (!idMap.has(node.id)) {
      idMap.set(node.id, { ...node })
      nodes.push({ ...node })
    }
    if (parentId) {
      links.push({ source: parentId, target: node.id, value: 1 })
    }
    if (node.children) {
      node.children.forEach(child => traverse(child, node.id))
    }
  }

  treeData.forEach(root => traverse(root))
  return { nodes, links }
}

const getData = () => {
  if (props.customData?.nodes) return props.customData
  return buildForceData(familyTreeData)
}

const findZoomGroup = () => {
  if (!containerRef.value) return null
  const svg = containerRef.value.closest('.tree-canvas')?.querySelector('svg')
  return svg?.querySelector('g')
}

const renderGraph = () => {
  const zoomGroup = findZoomGroup()
  if (!zoomGroup) return setTimeout(renderGraph, 100)

  if (simulation) simulation.stop()
  d3.select(zoomGroup).selectAll('.force-content').remove()

  const container = containerRef.value.closest('.tree-canvas')
  if (!container) return

  const width = container.clientWidth
  const height = container.clientHeight
  const data = getData()

  const graphGroup = d3.select(zoomGroup)
    .append('g')
    .attr('class', 'force-content')

  const colorScale = d3.scaleOrdinal(d3.schemeCategory10)

  simulation = d3.forceSimulation(data.nodes)
    .force('link', d3.forceLink(data.links).id(d => d.id).distance(100))
    .force('charge', d3.forceManyBody().strength(props.chargeForce))
    .force('center', d3.forceCenter(width / 2, height / 2))

  const link = graphGroup.append('g')
    .selectAll('line')
    .data(data.links)
    .enter()
    .append('line')
    .attr('stroke', '#999')
    .attr('stroke-opacity', 0.6)
    .attr('stroke-width', d => Math.sqrt(d.value) * 2)

  const node = graphGroup.append('g')
    .selectAll('circle')
    .data(data.nodes)
    .enter()
    .append('circle')
    .attr('r', props.nodeRadius + 5)
    .attr('fill', d => colorScale(d.group || 1))
    .attr('stroke', '#fff')
    .attr('stroke-width', 2)
    .style('cursor', 'pointer')
    .on('click', (event, d) => {
      event.stopPropagation()
      clickHandler.handleSingleClick(d)
    })
    .on('dblclick', (event, d) => {
      event.stopPropagation()
      clickHandler.handleDoubleClick(d)
    })
    .call(d3.drag()
      .on('start', (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart()
        d.fx = d.x
        d.fy = d.y
      })
      .on('drag', (event, d) => {
        d.fx = event.x
        d.fy = event.y
      })
      .on('end', (event, d) => {
        if (!event.active) simulation.alphaTarget(0)
        d.fx = null
        d.fy = null
      }))

  node.append('title').text(d => `${d.name}\n${d.birthYear || ''}`)

  const labels = graphGroup.append('g')
    .selectAll('text')
    .data(data.nodes)
    .enter()
    .append('text')
    .text(d => d.name)
    .attr('font-size', '12px')
    .attr('dx', 12)
    .attr('dy', 4)
    .attr('fill', '#333')
    .style('pointer-events', 'none')

  simulation.on('tick', () => {
    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y)
    node.attr('cx', d => d.x).attr('cy', d => d.y)
    labels.attr('x', d => d.x).attr('y', d => d.y)
  })
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
    resizeObserver = new ResizeObserver(() => {
      if (simulation) {
        const w = container.clientWidth
        const h = container.clientHeight
        simulation.force('center', d3.forceCenter(w / 2, h / 2))
        simulation.alpha(0.3).restart()
      }
    })
    resizeObserver.observe(container)
  }
})
onUnmounted(() => {
  simulation?.stop()
  resizeObserver?.disconnect()
})
</script>

<style scoped>
.force-graph {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
</style>