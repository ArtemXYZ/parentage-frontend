<!-- components/widgets/trees/DendrogramGraph.vue -->
<template>
  <div class="dendrogram-graph" ref="containerRef"></div>
</template>

<script setup>
import * as d3 from 'd3'

const props = defineProps({
  customData: { type: Object, default: null },
  marginLeft: { type: Number, default: 120 },
  marginRight: { type: Number, default: 40 }
})

const containerRef = ref(null)
const tabsManager = inject('tabsManager')
const openEditor = inject('openEditor')
const clickHandler = new NodeClickHandler(tabsManager, openEditor)

const defaultHierarchy = {
  name: "Род Петровых",
  children: [
    {
      name: "Иван Петров (1950)",
      type: "person",
      children: [
        { name: "Алексей Иванов (1975)", type: "person", children: [
          { name: "Дмитрий Иванов (2000)", type: "person" },
          { name: "Анна Иванова (2002)", type: "person" }
        ]},
        { name: "Сергей Петров (1970)", type: "person", children: [
          { name: "Ольга Петрова (1995)", type: "person" }
        ]}
      ]
    },
    {
      name: "Мария Иванова (1955)",
      type: "person",
      children: [
        { name: "Елена Иванова (1978)", type: "person" }
      ]
    }
  ]
}

const getData = () => props.customData || defaultHierarchy

const findZoomGroup = () => {
  if (!containerRef.value) return null
  const svg = containerRef.value.closest('.tree-canvas')?.querySelector('svg')
  return svg?.querySelector('g')
}

const renderGraph = () => {
  const zoomGroup = findZoomGroup()
  if (!zoomGroup) return setTimeout(renderGraph, 100)

  d3.select(zoomGroup).selectAll('.dendrogram-content').remove()

  const container = containerRef.value.closest('.tree-canvas')
  if (!container) return

  const width = container.clientWidth
  const height = container.clientHeight
  const rootData = getData()
  const root = d3.hierarchy(rootData)
  d3.cluster().size([height, width - props.marginLeft - props.marginRight])(root)

  const graphGroup = d3.select(zoomGroup)
    .append('g')
    .attr('class', 'dendrogram-content')
    .attr('transform', `translate(${props.marginLeft}, 0)`)

  const diagonal = d3.linkHorizontal().x(d => d.y).y(d => d.x)

  graphGroup.selectAll('.link')
    .data(root.links())
    .enter()
    .append('path')
    .attr('class', 'link')
    .attr('d', diagonal)
    .attr('fill', 'none')
    .attr('stroke', '#ccc')
    .attr('stroke-width', 1.5)

  const node = graphGroup.selectAll('.node')
    .data(root.descendants())
    .enter()
    .append('g')
    .attr('class', 'node')
    .attr('transform', d => `translate(${d.y}, ${d.x})`)
    .style('cursor', 'pointer')
    .on('click', (event, d) => {
      event.stopPropagation()
      clickHandler.handlePersonClick(d.data)
    })

  node.append('circle')
    .attr('r', 5)
    .attr('fill', d => d.children ? '#4a90e2' : '#e24a4a')
    .attr('stroke', '#fff')
    .attr('stroke-width', 1.5)

  node.append('text')
    .attr('dy', '0.32em')
    .attr('dx', d => d.children ? -8 : 8)
    .attr('text-anchor', d => d.children ? 'end' : 'start')
    .style('font-size', '12px')
    .style('fill', '#333')
    .style('pointer-events', 'none')
    .text(d => d.data.name)
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
.dendrogram-graph {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
:deep(.link) { pointer-events: none; }
:deep(.node circle:hover) { r: 7; fill: #ff6b6b; }
</style>