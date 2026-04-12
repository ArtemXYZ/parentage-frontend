<script setup>
import * as d3 from 'd3'

const props = defineProps({
  nodeRadius: { type: Number, default: 5 },
  chargeForce: { type: Number, default: -60 },
  customData: { type: Object, default: null }
})

const containerRef = ref(null)
let simulation = null
let currentZoomGroup = null

// Дефолтные данные
const defaultData = {
  nodes: [
    { id: 0, name: "Иван Петров", group: 1, birthYear: 1950, gender: "male" },
    { id: 1, name: "Мария Иванова", group: 1, birthYear: 1955, gender: "female" },
    { id: 2, name: "Алексей Иванов", group: 2, birthYear: 1975, gender: "male" },
    { id: 3, name: "Елена Иванова", group: 2, birthYear: 1978, gender: "female" },
    { id: 4, name: "Дмитрий Иванов", group: 3, birthYear: 2000, gender: "male" },
    { id: 5, name: "Анна Иванова", group: 3, birthYear: 2002, gender: "female" },
    { id: 6, name: "Сергей Петров", group: 2, birthYear: 1970, gender: "male" },
    { id: 7, name: "Ольга Петрова", group: 3, birthYear: 1995, gender: "female" }
  ],
  links: [
    { source: 0, target: 1, value: 1 },
    { source: 0, target: 2, value: 2 },
    { source: 1, target: 2, value: 2 },
    { source: 2, target: 3, value: 1 },
    { source: 2, target: 4, value: 2 },
    { source: 2, target: 5, value: 2 },
    { source: 3, target: 4, value: 2 },
    { source: 3, target: 5, value: 2 },
    { source: 0, target: 6, value: 1 },
    { source: 6, target: 7, value: 1 }
  ]
}

const getData = () => {
  if (props.customData && props.customData.nodes) return props.customData
  return defaultData
}

const findZoomGroup = () => {
  if (!containerRef.value) return null
  const svg = containerRef.value.closest('.tree-canvas')?.querySelector('svg')
  if (!svg) return null
  return svg.querySelector('g')
}

const renderGraph = () => {
  const zoomGroup = findZoomGroup()
  if (!zoomGroup) {
    setTimeout(renderGraph, 100)
    return
  }

  // Останавливаем старую симуляцию
  if (simulation) {
    simulation.stop()
  }

  // Удаляем старый контент
  const existingGraph = zoomGroup.querySelector('.force-graph-content')
  if (existingGraph) {
    existingGraph.remove()
  }

  currentZoomGroup = zoomGroup

  const container = containerRef.value.closest('.tree-canvas')
  if (!container) return

  const width = container.clientWidth
  const height = container.clientHeight
  const data = getData()

  const colorScale = d3.scaleOrdinal(d3.schemeCategory10)

  // Создаём группу для графа
  const graphGroup = d3.select(zoomGroup)
    .append('g')
    .attr('class', 'force-graph-content')

  // Симуляция
  simulation = d3.forceSimulation(data.nodes)
    .force('link', d3.forceLink(data.links).id(d => d.id).distance(100))
    .force('charge', d3.forceManyBody().strength(props.chargeForce))
    .force('center', d3.forceCenter(width / 2, height / 2))

  // Линии (связи)
  const link = graphGroup.append('g')
    .selectAll('line')
    .data(data.links)
    .enter()
    .append('line')
    .attr('stroke', '#999')
    .attr('stroke-opacity', 0.6)
    .attr('stroke-width', d => Math.sqrt(d.value) * 2)

  // Узлы (кружки)
  const node = graphGroup.append('g')
    .selectAll('circle')
    .data(data.nodes)
    .enter()
    .append('circle')
    .attr('r', props.nodeRadius + 5)
    .attr('fill', d => colorScale(d.group))
    .attr('stroke', '#fff')
    .attr('stroke-width', 2)
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

  // Всплывающие подсказки
  node.append('title')
    .text(d => `${d.name}\nГод рождения: ${d.birthYear || 'н/д'}`)

  // Подписи
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

  // Обновление позиций при каждом тике симуляции
  simulation.on('tick', () => {
    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y)
    
    node
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
    
    labels
      .attr('x', d => d.x)
      .attr('y', d => d.y)
  })
}

// Следим за появлением zoomGroup
watchEffect(() => {
  if (containerRef.value) {
    const zoomGroup = findZoomGroup()
    if (zoomGroup) {
      renderGraph()
    } else {
      const observer = new MutationObserver(() => {
        const zg = findZoomGroup()
        if (zg) {
          observer.disconnect()
          renderGraph()
        }
      })
      observer.observe(containerRef.value.closest('.tree-canvas') || document.body, {
        childList: true,
        subtree: true
      })
    }
  }
})

// Следим за изменением данных
watch(() => props.customData, () => {
  renderGraph()
}, { deep: true })

// Следим за изменением размеров
let resizeObserver
onMounted(() => {
  const container = containerRef.value?.closest('.tree-canvas')
  if (container && window.ResizeObserver) {
    resizeObserver = new ResizeObserver(() => {
      if (simulation) {
        const width = container.clientWidth
        const height = container.clientHeight
        simulation.force('center', d3.forceCenter(width / 2, height / 2))
        simulation.alpha(0.3).restart()
      }
    })
    resizeObserver.observe(container)
  }
})

onUnmounted(() => {
  if (simulation) simulation.stop()
  if (resizeObserver) resizeObserver.disconnect()
})
</script>

<template>
  <div class="force-graph-integration" ref="containerRef"></div>
</template>

<style scoped>
.force-graph-integration {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.force-graph-content {
  pointer-events: auto;
}
</style>