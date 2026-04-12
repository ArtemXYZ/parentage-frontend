<script setup>
import * as d3 from 'd3'

const props = defineProps({
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: '100%'
  },
  nodeRadius: {
    type: Number,
    default: 5
  },
  chargeForce: {
    type: Number,
    default: -60
  }
})

const chartContainer = ref(null)
let simulation = null
let svg = null

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

const apiResponse = null

const getData = () => {
  if (apiResponse && apiResponse.nodes && apiResponse.nodes.length > 0) {
    return apiResponse
  }
  return defaultData
}

const initGraph = () => {
  if (!chartContainer.value) return
  
  const data = getData()
  // Берем реальные размеры контейнера для force-симуляции
  const width = chartContainer.value.clientWidth
  const height = chartContainer.value.clientHeight
  
  const colorScale = d3.scaleOrdinal(d3.schemeCategory10)
  
  svg = d3.select(chartContainer.value)
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('viewBox', `0 0 ${width} ${height}`)
  
  simulation = d3.forceSimulation(data.nodes)
    .force('link', d3.forceLink(data.links).id(d => d.id).distance(100))
    .force('charge', d3.forceManyBody().strength(props.chargeForce))
    .force('center', d3.forceCenter(width / 2, height / 2))
  
  const link = svg.append('g')
    .selectAll('line')
    .data(data.links)
    .enter()
    .append('line')
    .attr('stroke', '#999')
    .attr('stroke-opacity', 0.6)
    .attr('stroke-width', d => Math.sqrt(d.value) * 2)
  
  const node = svg.append('g')
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
  
  node.append('title')
    .text(d => `${d.name}\nГод рождения: ${d.birthYear || 'н/д'}`)
  
  const labels = svg.append('g')
    .selectAll('text')
    .data(data.nodes)
    .enter()
    .append('text')
    .text(d => d.name)
    .attr('font-size', '12px')
    .attr('dx', 12)
    .attr('dy', 4)
    .attr('fill', '#333')
  
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

onMounted(() => {
  initGraph()
  
  // Обновляем при изменении размера окна
  window.addEventListener('resize', () => {
    if (svg) {
      const width = chartContainer.value.clientWidth
      const height = chartContainer.value.clientHeight
      svg.attr('viewBox', `0 0 ${width} ${height}`)
      simulation.force('center', d3.forceCenter(width / 2, height / 2))
      simulation.alpha(0.3).restart()
    }
  })
})

onUnmounted(() => {
  if (simulation) {
    simulation.stop()
  }
})
</script>

<template>
  <div ref="chartContainer" class="force-directed-tree"></div>
</template>

<style scoped>
.force-directed-tree {
  width: v-bind(width);
  height: v-bind(height);
  min-height: 500px;
  background: transparent;
}

.force-directed-tree svg {
  width: 100%;
  height: 100%;
}
</style>