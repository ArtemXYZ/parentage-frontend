<!-- components/construction/sections/LeftDock.vue -->
<template>
  <div class="left-dock">
    <div class="icon-bar">
      <div
        v-for="item in dockItems"
        :key="item.id"
        class="icon-item"
        :class="{ active: activeIcon === item.id }"
        @click="toggleSlideout(item.id)"
      >
        <span class="icon">{{ item.icon }}</span>
        <span class="tooltip">{{ item.label }}</span>
      </div>
    </div>

    <transition name="slide">
      <div v-if="activeSlideout" class="slideout-panel" :style="{ width: slideoutWidth + 'px' }">
        <div class="slideout-header">
          <span>{{ currentSlideoutLabel }}</span>
          <button class="resize-handle" @mousedown="startResize">⋮</button>
        </div>
        <div class="slideout-content">
          <!-- Древовидное меню на основе роутов -->
          <TreeMenu :routes-tree="routesTree" @navigate="closeSlideout" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
// import { ref, computed } from 'vue'
// import { useRoutesTree } from '~/composables/useRoutesTree'
// import { useLocalStorage } from '~/composables/useLocalStorage'

const dockItems = [
  { id: 'tree', icon: '🌳', label: 'Древо' },
  { id: 'search', icon: '🔍', label: 'Поиск' },
  { id: 'settings', icon: '⚙️', label: 'Настройки' },
]

const activeIcon = ref(null)
const activeSlideout = ref(null)
const slideoutWidth = useLocalStorage('left-slideout-width', 280)

const routesTree = useRoutesTree() // получаем иерархическое дерево роутов

const currentSlideoutLabel = computed(() => {
  const item = dockItems.find(i => i.id === activeSlideout.value)
  return item ? item.label : ''
})

function toggleSlideout(id) {
  if (activeSlideout.value === id) {
    activeSlideout.value = null
    activeIcon.value = null
  } else {
    activeSlideout.value = id
    activeIcon.value = id
  }
}

function closeSlideout() {
  activeSlideout.value = null
  activeIcon.value = null
}

// Ресайз панели
let startX, startWidth
function startResize(e) {
  startX = e.clientX
  startWidth = slideoutWidth.value
  window.addEventListener('mousemove', onResize)
  window.addEventListener('mouseup', stopResize)
}
function onResize(e) {
  let newWidth = startWidth + (e.clientX - startX)
  newWidth = Math.min(500, Math.max(180, newWidth))
  slideoutWidth.value = newWidth
}
function stopResize() {
  window.removeEventListener('mousemove', onResize)
  window.removeEventListener('mouseup', stopResize)
}
</script>

<style scoped>
.left-dock {
  position: relative;
  z-index: 20;
}

.icon-bar {
  width: 45px;
  background: #693030f2;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 1rem;
  height: 100%;
}

.icon-item {
  position: relative;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  transition: background 0.2s;
}

.icon-item:hover {
  background: #73f051f2;
}

.icon-item.active {
  background: #1abc9c;
}

.icon {
  font-size: 1.5rem;
}

.tooltip {
  position: absolute;
  left: 60px;
  background: #34495e;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s;
}

.icon-item:hover .tooltip {
  opacity: 1;
}

.slideout-panel {
  position: absolute;
  top: 0;
  left: 60px;
  height: 100%;
  background: #ecf0f1;
  box-shadow: 2px 0 8px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  z-index: 25;
  border-right: 1px solid #bdc3c7;
}

.slideout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #d5dbdb;
  font-weight: bold;
  border-bottom: 1px solid #bdc3c7;
}

.resize-handle {
  cursor: ew-resize;
  background: none;
  border: none;
  font-size: 1.2rem;
}

.slideout-content {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem;
}

.slide-enter-active, .slide-leave-active {
  transition: transform 0.2s ease;
}
.slide-enter-from, .slide-leave-to {
  transform: translateX(-100%);
}
</style>