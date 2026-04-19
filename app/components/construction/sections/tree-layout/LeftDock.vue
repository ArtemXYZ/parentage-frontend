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
        <Icon :name="item.iconName" class="dock-icon" />
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
          <!-- Иерархия родственников для вкладки "Древо" -->
          <FamilyTreeMenu v-if="activeSlideout === 'tree'" />
          <!-- Заглушки для других вкладок -->
          <div v-else-if="activeSlideout === 'search'" class="placeholder-content">
            <Icon name="ph:magnifying-glass" class="placeholder-icon" />
            <p>Поиск по древу</p>
          </div>
          <div v-else-if="activeSlideout === 'settings'" class="placeholder-content">
            <Icon name="ph:gear" class="placeholder-icon" />
            <p>Настройки</p>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
const dockItems = [
  { id: 'tree', iconName: 'ph:git-branch', label: 'Древо' },
  { id: 'search', iconName: 'ph:magnifying-glass', label: 'Поиск' },
  { id: 'settings', iconName: 'ph:gear', label: 'Настройки' },
]

const activeIcon = ref(null)
const activeSlideout = ref(null)
const slideoutWidth = useLocalStorage('left-slideout-width', 280)

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
  width: 40px;
  background: #1e2a36;
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
  color: #bdc3c7;
}

.icon-item:hover {
  background: #2c3e50;
  color: #ffffff;
}

.icon-item.active {
  background: #1abc9c;
  color: #ffffff;
}

.dock-icon {
  width: 22px;
  height: 22px;
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
  left: 40px;
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

.placeholder-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #64748b;
  text-align: center;
  padding: 2rem;
}

.placeholder-icon {
  width: 48px;
  height: 48px;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.slide-enter-active, .slide-leave-active {
  transition: transform 0.2s ease;
}
.slide-enter-from, .slide-leave-to {
  transform: translateX(-100%);
}
</style>