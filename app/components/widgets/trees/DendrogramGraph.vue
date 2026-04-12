<script setup>
import * as d3 from 'd3'

const props = defineProps({
  customData: { type: Object, default: null },
  marginLeft: { type: Number, default: 120 },
  marginRight: { type: Number, default: 40 }
})

const containerRef = ref(null)
let currentZoomGroup = null
let currentData = null

// Дефолтные данные
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

const getData = () => {
  if (props.customData) return props.customData
  return defaultHierarchy
}

// Поиск группы зума от TreeCanvas
const findZoomGroup = () => {
  if (!containerRef.value) return null
  const svg = containerRef.value.closest('.tree-canvas')?.querySelector('svg')
  if (!svg) return null
  return svg.querySelector('g') // это zoomGroup
}

// Отрисовка графа
const renderGraph = () => {
  const zoomGroup = findZoomGroup()
  if (!zoomGroup) {
    console.warn('Zoom group not found, retrying...')
    setTimeout(renderGraph, 100)
    return
  }

  currentZoomGroup = zoomGroup
  
  // Очищаем предыдущий граф (но сохраняем трансформацию)
  const existingGraph = zoomGroup.querySelector('.dendrogram-content')
  if (existingGraph) {
    existingGraph.remove()
  }

  // Получаем размеры контейнера
  const container = containerRef.value.closest('.tree-canvas')
  if (!container) return
  
  const width = container.clientWidth
  const height = container.clientHeight

  const rootData = getData()
  currentData = rootData

  // Создаём иерархию
  const root = d3.hierarchy(rootData)
  const clusterLayout = d3.cluster()
    .size([height, width - props.marginLeft - props.marginRight])
  clusterLayout(root)

  // Создаём группу для содержимого дендрограммы
  const graphGroup = d3.select(zoomGroup)
    .append('g')
    .attr('class', 'dendrogram-content')
    .attr('transform', `translate(${props.marginLeft}, 0)`)

  // Рисуем линии (диагонали)
  const diagonal = d3.linkHorizontal()
    .x(d => d.y)
    .y(d => d.x)

  graphGroup.selectAll('.link')
    .data(root.links())
    .enter()
    .append('path')
    .attr('class', 'link')
    .attr('d', diagonal)
    .attr('fill', 'none')
    .attr('stroke', '#ccc')
    .attr('stroke-width', 1.5)

  // Рисуем узлы
  const node = graphGroup.selectAll('.node')
    .data(root.descendants())
    .enter()
    .append('g')
    .attr('class', 'node')
    .attr('transform', d => `translate(${d.y}, ${d.x})`)

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
    .text(d => d.data.name)

  node.append('title')
    .text(d => d.data.type === 'person' ? `${d.data.name}\nПерсона` : d.data.name)
}

// Следим за появлением zoomGroup (может монтироваться позже)
watchEffect(() => {
  if (containerRef.value) {
    const zoomGroup = findZoomGroup()
    if (zoomGroup) {
      renderGraph()
    } else {
      // Ждём появления
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
    resizeObserver = new ResizeObserver(() => renderGraph())
    resizeObserver.observe(container)
  }
})

onUnmounted(() => {
  if (resizeObserver) resizeObserver.disconnect()
})
</script>

<template>
  <div class="dendrogram-integration" ref="containerRef"></div>
</template>

<style scoped>
.dendrogram-integration {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none; /* Чтобы клики проходили сквозь контейнер к узлам */
}

:deep(.link) {
  pointer-events: none;
}

:deep(.node) {
  pointer-events: auto;
  cursor: pointer;
}

:deep(.node circle:hover) {
  r: 7;
  fill: #ff6b6b;
}

:deep(.node text:hover) {
  font-size: 14px;
  font-weight: bold;
}
</style>