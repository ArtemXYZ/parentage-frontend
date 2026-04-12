<script setup>
import * as d3 from 'd3'

const props = defineProps({
  customData: { type: Object, default: null },
  radius: { type: Number, default: 450 },
  margin: { type: Number, default: 40 }
})

const containerRef = ref(null)
let currentZoomGroup = null

// Дефолтные данные
const defaultHierarchy = {
  name: "Род Петровых",
  children: [
    {
      name: "Иван Петров (1950)",
      birthYear: 1950,
      children: [
        { 
          name: "Алексей Иванов (1975)", 
          birthYear: 1975,
          children: [
            { name: "Дмитрий Иванов (2000)", birthYear: 2000 },
            { name: "Анна Иванова (2002)", birthYear: 2002 }
          ]
        },
        { name: "Сергей Петров (1970)", birthYear: 1970, children: [
          { name: "Ольга Петрова (1995)", birthYear: 1995 }
        ]}
      ]
    },
    {
      name: "Мария Иванова (1955)",
      birthYear: 1955,
      children: [
        { name: "Елена Иванова (1978)", birthYear: 1978 }
      ]
    }
  ]
}

const getData = () => {
  if (props.customData) return props.customData
  return defaultHierarchy
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

  // Удаляем старый контент
  const existingGraph = zoomGroup.querySelector('.radial-tree-content')
  if (existingGraph) {
    existingGraph.remove()
  }

  currentZoomGroup = zoomGroup

  const container = containerRef.value.closest('.tree-canvas')
  if (!container) return

  const width = container.clientWidth
  const height = container.clientHeight
  const currentRadius = Math.min(width, height) / 2 - props.margin

  const rootData = getData()
  const root = d3.hierarchy(rootData)
  
  const treeLayout = d3.tree()
    .size([360, currentRadius])
    .separation((a, b) => {
      return (a.parent === b.parent ? 1 : 2) / a.depth || 1
    })

  const treeData = treeLayout(root)

  // Создаём группу для радиального дерева
  const graphGroup = d3.select(zoomGroup)
    .append('g')
    .attr('class', 'radial-tree-content')
    .attr('transform', `translate(${width / 2}, ${height / 2})`)

  // Генератор радиальных диагоналей
  const radialDiagonal = d3.linkRadial()
    .angle(d => d.x * Math.PI / 180)
    .radius(d => d.y)

  // Рисуем связи
  graphGroup.selectAll('.link')
    .data(treeData.links())
    .enter()
    .append('path')
    .attr('class', 'link')
    .attr('d', radialDiagonal)
    .attr('fill', 'none')
    .attr('stroke', '#ccc')
    .attr('stroke-width', 1.5)
    .attr('stroke-opacity', 0.7)

  // Рисуем узлы
  const node = graphGroup.selectAll('.node')
    .data(treeData.descendants())
    .enter()
    .append('g')
    .attr('class', 'node')
    .attr('transform', d => `rotate(${d.x - 90}) translate(${d.y}, 0)`)

  node.append('circle')
    .attr('r', 5)
    .attr('fill', d => {
      if (d.data.name.includes('Иван') || d.data.name.includes('Алексей') || 
          d.data.name.includes('Сергей') || d.data.name.includes('Дмитрий')) {
        return '#4a90e2'
      } else if (d.data.name.includes('Мария') || d.data.name.includes('Анна') || 
                 d.data.name.includes('Елена') || d.data.name.includes('Ольга')) {
        return '#e24a4a'
      }
      return d.children ? '#ff9a3c' : '#8b8b8b'
    })
    .attr('stroke', '#fff')
    .attr('stroke-width', 2)
    .attr('cursor', 'pointer')

  node.append('text')
    .attr('dy', '0.31em')
    .attr('dx', d => d.x < 180 ? 10 : -10)
    .attr('text-anchor', d => d.x < 180 ? 'start' : 'end')
    .attr('transform', d => d.x < 180 ? null : 'rotate(180)')
    .style('font-size', '11px')
    .style('fill', '#333')
    .style('cursor', 'pointer')
    .text(d => d.data.name)

  node.append('title')
    .text(d => {
      if (d.data.birthYear) {
        return `${d.data.name}\nГод рождения: ${d.data.birthYear}`
      }
      return d.data.name
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
    resizeObserver = new ResizeObserver(() => renderGraph())
    resizeObserver.observe(container)
  }
})

onUnmounted(() => {
  if (resizeObserver) resizeObserver.disconnect()
})
</script>

<template>
  <div class="radial-tree-integration" ref="containerRef"></div>
</template>

<style scoped>
.radial-tree-integration {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

:deep(.link) {
  transition: stroke 0.3s ease;
}

:deep(.node circle) {
  transition: r 0.2s ease, fill 0.2s ease;
}

:deep(.node circle:hover) {
  r: 7;
  filter: drop-shadow(0 0 4px rgba(0,0,0,0.3));
}

:deep(.node text) {
  transition: font-size 0.2s ease;
  font-weight: normal;
}

:deep(.node text:hover) {
  font-size: 12px;
  font-weight: bold;
  fill: #000;
}

@media (max-width: 768px) {
  :deep(.node text) {
    font-size: 9px;
  }
  :deep(.node circle) {
    r: 4;
  }
  :deep(.node circle:hover) {
    r: 6;
  }
}
</style>