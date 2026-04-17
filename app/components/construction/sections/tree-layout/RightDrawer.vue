<!-- components/construction/sections/tree-layout/RightDrawer.vue -->
<template>
  <div 
    class="right-drawer" 
    :class="{ expanded: isExpanded }"
    :style="{ width: isExpanded ? `${drawerWidth}px` : '40px' }"
  >
    <div class="drawer-toggle" @click="toggleExpand">
      <span class="toggle-icon">{{ isExpanded ? '➡️' : '⬅️' }}</span>
    </div>
    <div v-if="isExpanded" class="drawer-content">
      <div class="drawer-header">
        <span>Редактор</span>
        <button class="close-btn" @click="close">✕</button>
      </div>
      <div class="drawer-body">
        <slot>
          <p>Информация о персоне</p>
        </slot>
      </div>
      <div class="resize-handle" @mousedown="startResize"></div>
    </div>
  </div>
</template>

<script setup>
import { useLocalStorage } from '~/composables/useLocalStorage'

const isExpanded = ref(false)
const drawerWidth = useLocalStorage('right-drawer-width', 300)

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}

const close = () => {
  isExpanded.value = false
}

let startX, startWidth
function startResize(e) {
  e.preventDefault()
  startX = e.clientX
  startWidth = drawerWidth.value
  window.addEventListener('mousemove', onResize)
  window.addEventListener('mouseup', stopResize)
}
function onResize(e) {
  let newWidth = startWidth - (e.clientX - startX)
  newWidth = Math.min(600, Math.max(200, newWidth))
  drawerWidth.value = newWidth
}
function stopResize() {
  window.removeEventListener('mousemove', onResize)
  window.removeEventListener('mouseup', stopResize)
}
</script>

<style scoped>
.right-drawer {
  position: relative;
  height: 100%;
  background: white;
  box-shadow: -2px 0 8px rgba(0,0,0,0.1);
  z-index: 40;
  transition: width 0.2s ease;
  display: flex;
  flex-direction: column;
  border-left: 1px solid #ddd;
  flex-shrink: 0;
}

.drawer-toggle {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: #f8f9fa;
  border-bottom: 1px solid #ddd;
  transition: background 0.2s;
}
.drawer-toggle:hover {
  background: #e9ecef;
}
.toggle-icon {
  font-size: 1.2rem;
}

.drawer-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f8f9fa;
  border-bottom: 1px solid #ddd;
}
.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
}
.drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}
.resize-handle {
  position: absolute;
  left: -5px;
  top: 0;
  width: 8px;
  height: 100%;
  cursor: ew-resize;
  background: transparent;
}
.resize-handle:hover {
  background: rgba(0,0,0,0.1);
}
</style>