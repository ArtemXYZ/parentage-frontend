<script setup>
import * as d3 from 'd3'

// Пропсы компонента
const props = defineProps({
  // Кастомные данные для графа (если не переданы, используются дефолтные)
  customData: {
    type: Object,
    default: null
  },
  // Отступ для графа от левого края (для подписей)
  marginLeft: {
    type: Number,
    default: 120
  },
  // Отступ справа для длинных имен
  marginRight: {
    type: Number,
    default: 40
  }
})

// Реактивные ссылки на DOM-элементы
const chartContainer = ref(null)
let svg = null
let innerGroup = null
let currentData = null

// --- ДЕФОЛТНЫЕ ДАННЫЕ (ЗАГЛУШКА) ---
// Имитирует иерархическую структуру семейного древа
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

// Заглушка ответа от API (null = нет данных)
const apiResponse = null

// Функция получения данных для отображения
const getData = () => {
  // --- КОГДА ПОЯВИТСЯ API, РАСКОММЕНТИРОВАТЬ ЭТОТ БЛОК ---
  // if (props.customData) {
  //   return props.customData
  // }
  // if (apiResponse && apiResponse.name) {
  //   return apiResponse
  // }
  
  // ПОКА ИСПОЛЬЗУЕМ ДЕФОЛТНЫЕ ДАННЫЕ
  return defaultHierarchy
}

// --- ОСНОВНАЯ ФУНКЦИЯ ПОСТРОЕНИЯ ГРАФА ---
const initGraph = () => {
  if (!chartContainer.value) return

  // Получаем актуальные размеры контейнера
  const width = chartContainer.value.clientWidth
  const height = chartContainer.value.clientHeight
  
  // Очищаем предыдущий граф, если он был
  if (svg) {
    svg.remove()
  }

  // Получаем иерархические данные
  const rootData = getData()
  currentData = rootData

  // 1. ПРЕОБРАЗУЕМ ДАННЫЕ В СТРУКТУРУ D3 HIERARCHY
  const root = d3.hierarchy(rootData)
  
  // 2. СОЗДАЕМ КЛАСТЕРНЫЙ МАКЕТ (DENDOGRAM)
  //    Размер: высота (height) на ширину (width - отступы)
  const clusterLayout = d3.cluster()
    .size([height, width - props.marginLeft - props.marginRight])

  // Применяем макет к данным
  clusterLayout(root)

  // 3. СОЗДАЕМ SVG-ПОЛОТНО
  svg = d3.select(chartContainer.value)
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .style('background', 'transparent') // Прозрачный фон
    .style('font-family', 'Arial, sans-serif')

  // 4. ДОБАВЛЯЕМ ГРУППУ ДЛЯ ВНУТРЕННИХ ЭЛЕМЕНТОВ СО СМЕЩЕНИЕМ
  innerGroup = svg.append('g')
    .attr('transform', `translate(${props.marginLeft}, 0)`)

  // 5. РИСУЕМ ЛИНИИ (СВЯЗИ) - ДИАГОНАЛИ
  //    Генератор диагоналей для кластерного графа
  const diagonal = d3.linkHorizontal()
    .x(d => d.y)   // В кластерном макете y = горизонтальная позиция
    .y(d => d.x)   // x = вертикальная позиция

  // Привязываем данные связей и отрисовываем
  innerGroup.selectAll('.link')
    .data(root.links())
    .enter()
    .append('path')
    .attr('class', 'link')
    .attr('d', diagonal)
    .attr('fill', 'none')
    .attr('stroke', '#ccc')
    .attr('stroke-width', 1.5)

  // 6. РИСУЕМ УЗЛЫ (КРУЖКИ С ИМЕНАМИ)
  const node = innerGroup.selectAll('.node')
    .data(root.descendants())
    .enter()
    .append('g')
    .attr('class', 'node')
    .attr('transform', d => `translate(${d.y}, ${d.x})`)

  // Добавляем кружок для каждого узла
  node.append('circle')
    .attr('r', 5)
    .attr('fill', d => d.children ? '#4a90e2' : '#e24a4a') // Синий для родителей, красный для листьев
    .attr('stroke', '#fff')
    .attr('stroke-width', 1.5)

  // Добавляем подпись (имя) для каждого узла
  node.append('text')
    .attr('dy', '0.32em')
    .attr('dx', d => d.children ? -8 : 8)
    .attr('text-anchor', d => d.children ? 'end' : 'start')
    .style('font-size', '12px')
    .style('fill', '#333')
    .text(d => d.data.name)

  // Добавляем всплывающую подсказку с дополнительной информацией
  node.append('title')
    .text(d => {
      if (d.data.type === 'person') {
        return `${d.data.name}\nПерсона`
      }
      return d.data.name
    })
}

// --- СЛЕДИМ ЗА ИЗМЕНЕНИЕМ РАЗМЕРА ОКНА ---
const handleResize = () => {
  if (!chartContainer.value || !svg) return
  
  const width = chartContainer.value.clientWidth
  const height = chartContainer.value.clientHeight
  
  svg.attr('viewBox', `0 0 ${width} ${height}`)
  
  // Перестраиваем граф при изменении размера
  initGraph()
}

// --- ЖИЗНЕННЫЙ ЦИКЛ КОМПОНЕНТА ---
onMounted(() => {
  initGraph()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (svg) {
    svg.remove()
  }
})

// Следим за изменением входных данных
watch(() => props.customData, () => {
  initGraph()
}, { deep: true })
</script>

<template>
  <div class="dendrogram-tree" ref="chartContainer"></div>
</template>

<style scoped>
.dendrogram-tree {
  width: 100%;
  height: 100%;
  min-height: 600px; /* Минимальная высота для комфортного просмотра */
  background: transparent;
  overflow: auto; /* Добавляем скролл при необходимости */
}

/* Дополнительные стили для лучшей читаемости */
:deep(.link) {
  transition: stroke 0.2s ease;
}

:deep(.node circle) {
  transition: r 0.2s ease, fill 0.2s ease;
  cursor: pointer;
}

:deep(.node circle:hover) {
  r: 7;
  fill: #ff6b6b;
}

:deep(.node text) {
  transition: font-size 0.2s ease;
  cursor: pointer;
  user-select: none;
}

:deep(.node text:hover) {
  font-size: 14px;
  font-weight: bold;
}
</style>