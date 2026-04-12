<script setup>
import * as d3 from 'd3'

// Пропсы компонента
const props = defineProps({
  // Кастомные данные для графа (если не переданы, используются дефолтные)
  customData: {
    type: Object,
    default: null
  },
  // Радиус для древовидной компоновки (от центра)
  radius: {
    type: Number,
    default: 450
  },
  // Отступ от краев (чтобы узлы не прилипали к границе)
  margin: {
    type: Number,
    default: 40
  }
})

// Реактивные ссылки
const chartContainer = ref(null)
let svg = null
let innerGroup = null

// --- ДЕФОЛТНЫЕ ДАННЫЕ (ЗАГЛУШКА) ---
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

// --- ОСНОВНАЯ ФУНКЦИЯ ПОСТРОЕНИЯ РАДИАЛЬНОГО ГРАФА ---
const initGraph = () => {
  if (!chartContainer.value) return

  // Получаем актуальные размеры контейнера
  const width = chartContainer.value.clientWidth
  const height = chartContainer.value.clientHeight
  
  // Вычисляем радиус с учетом отступов
  const currentRadius = Math.min(width, height) / 2 - props.margin
  
  // Очищаем предыдущий граф
  if (svg) {
    svg.remove()
  }

  // Получаем иерархические данные
  const rootData = getData()

  // 1. ПРЕОБРАЗУЕМ ДАННЫЕ В СТРУКТУРУ D3 HIERARCHY
  const root = d3.hierarchy(rootData)
  
  // 2. СОЗДАЕМ РАДИАЛЬНЫЙ ДРЕВОВИДНЫЙ МАКЕТ (RADIAL TREE)
  //    Размер: угол от 0 до 360 градусов, радиус от 0 до currentRadius
  const treeLayout = d3.tree()
    .size([360, currentRadius])
    .separation((a, b) => {
      // Настраиваем расстояние между узлами для лучшей читаемости
      return (a.parent === b.parent ? 1 : 2) / a.depth || 1
    })

  // Применяем макет к данным
  const treeData = treeLayout(root)

  // 3. СОЗДАЕМ SVG-ПОЛОТНО
  svg = d3.select(chartContainer.value)
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .style('background', 'transparent')
    .style('font-family', 'Arial, sans-serif')

  // 4. ГРУППА В ЦЕНТРЕ (ДЛЯ РАДИАЛЬНОГО ОТОБРАЖЕНИЯ)
  innerGroup = svg.append('g')
    .attr('transform', `translate(${width / 2}, ${height / 2})`)

  // 5. ГЕНЕРАТОР РАДИАЛЬНЫХ ДИАГОНАЛЕЙ ДЛЯ СВЯЗЕЙ
  const radialDiagonal = d3.linkRadial()
    .angle(d => d.x * Math.PI / 180)  // Переводим градусы в радианы
    .radius(d => d.y)

  // 6. РИСУЕМ ЛИНИИ (СВЯЗИ)
  innerGroup.selectAll('.link')
    .data(treeData.links())
    .enter()
    .append('path')
    .attr('class', 'link')
    .attr('d', radialDiagonal)
    .attr('fill', 'none')
    .attr('stroke', '#ccc')
    .attr('stroke-width', 1.5)
    .attr('stroke-opacity', 0.7)

  // 7. РИСУЕМ УЗЛЫ (КРУЖКИ)
  const node = innerGroup.selectAll('.node')
    .data(treeData.descendants())
    .enter()
    .append('g')
    .attr('class', 'node')
    .attr('transform', d => {
      // В радиальной компоновке: угол (x) и радиус (y)
      return `rotate(${d.x - 90}) translate(${d.y}, 0)`
    })

  // Добавляем кружок для каждого узла
  node.append('circle')
    .attr('r', 5)
    .attr('fill', d => {
      // Разный цвет для мужчин/женщин/групп
      if (d.data.name.includes('Иван') || d.data.name.includes('Алексей') || 
          d.data.name.includes('Сергей') || d.data.name.includes('Дмитрий')) {
        return '#4a90e2' // Мужской (синий)
      } else if (d.data.name.includes('Мария') || d.data.name.includes('Анна') || 
                 d.data.name.includes('Елена') || d.data.name.includes('Ольга')) {
        return '#e24a4a' // Женский (красный)
      }
      return d.children ? '#ff9a3c' : '#8b8b8b' // Родители - оранжевый, листья - серый
    })
    .attr('stroke', '#fff')
    .attr('stroke-width', 2)
    .attr('cursor', 'pointer')

  // Добавляем подпись (имя) для каждого узла
  node.append('text')
    .attr('dy', '0.31em')
    .attr('dx', d => {
      // Размещаем текст с нужной стороны в зависимости от угла
      const angle = d.x
      return angle < 180 ? 10 : -10
    })
    .attr('text-anchor', d => d.x < 180 ? 'start' : 'end')
    .attr('transform', d => d.x < 180 ? null : 'rotate(180)')
    .style('font-size', '11px')
    .style('fill', '#333')
    .style('cursor', 'pointer')
    .text(d => d.data.name)

  // Добавляем всплывающую подсказку с информацией о годе рождения
  node.append('title')
    .text(d => {
      if (d.data.birthYear) {
        return `${d.data.name}\nГод рождения: ${d.data.birthYear}`
      }
      return d.data.name
    })

  // 8. ДОБАВЛЯЕМ АНИМАЦИЮ ПОЯВЛЕНИЯ
  svg.style('opacity', 0)
    .transition()
    .duration(500)
    .style('opacity', 1)
}

// --- СЛЕДИМ ЗА ИЗМЕНЕНИЕМ РАЗМЕРА ОКНА ---
const handleResize = () => {
  if (!chartContainer.value || !svg) return
  
  const width = chartContainer.value.clientWidth
  const height = chartContainer.value.clientHeight
  
  svg.attr('viewBox', `0 0 ${width} ${height}`)
  innerGroup.attr('transform', `translate(${width / 2}, ${height / 2})`)
  
  // Перестраиваем граф при значительном изменении размера
  initGraph()
}

// Используем debounce для оптимизации при ресайзе
let resizeTimer
const debouncedResize = () => {
  clearTimeout(resizeTimer)
  resizeTimer = setTimeout(handleResize, 250)
}

// --- ЖИЗНЕННЫЙ ЦИКЛ КОМПОНЕНТА ---
onMounted(() => {
  initGraph()
  window.addEventListener('resize', debouncedResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', debouncedResize)
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
  <div class="radial-tree" ref="chartContainer"></div>
</template>

<style scoped>
.radial-tree {
  width: 100%;
  height: 100%;
  min-height: 600px;
  background: transparent;
  overflow: visible;
}

/* Стили для улучшения визуального восприятия */
:deep(.link) {
  transition: stroke 0.3s ease, stroke-width 0.3s ease;
}

:deep(.node circle) {
  transition: r 0.2s ease, fill 0.2s ease, filter 0.2s ease;
}

:deep(.node circle:hover) {
  r: 7;
  filter: drop-shadow(0 0 4px rgba(0,0,0,0.3));
}

:deep(.node text) {
  transition: font-size 0.2s ease, font-weight 0.2s ease;
  font-weight: normal;
}

:deep(.node text:hover) {
  font-size: 12px;
  font-weight: bold;
  fill: #000;
}

/* Адаптивность для мобильных устройств */
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