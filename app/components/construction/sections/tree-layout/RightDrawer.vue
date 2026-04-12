<!-- components/construction/sections/RightDrawer.vue -->
<template>
  <div
    class="right-drawer"
    :class="{ expanded: isExpanded }"
    :style="{ width: isExpanded ? `calc(100% - 60px)` : `${drawerWidth}px` }"
    v-show="isOpen"
  >
    <div class="drawer-header">
      <span>{{ title }}</span>
      <div class="drawer-actions">
        <button @click="toggleExpand" class="icon-btn">
          {{ isExpanded ? '⤓' : '⤒' }}
        </button>
        <button @click="closeDrawer" class="icon-btn">✕</button>
      </div>
    </div>
    <div class="drawer-content">
      <slot>
        <!-- Здесь будет форма редактирования персоны -->
        <p>Информация о персоне</p>
      </slot>
    </div>
    <div class="resize-handle" @mousedown="startResize" v-if="!isExpanded"></div>
  </div>
</template>

<script setup>
// import { useDrawerStore } from '~/stores/drawer' // или composable
// import { useLocalStorage } from '~/composables/useLocalStorage'

const drawerStore = useDrawerStore()
const isOpen = computed(() => drawerStore.isOpen)
const title = computed(() => drawerStore.title)

const drawerWidth = useLocalStorage('right-drawer-width', 320)
const isExpanded = ref(false)

function toggleExpand() {
  isExpanded.value = !isExpanded.value
}

function closeDrawer() {
  drawerStore.close()
  isExpanded.value = false
}

// Ресайз (только когда не expanded)
let startX, startWidth
function startResize(e) {
  startX = e.clientX
  startWidth = drawerWidth.value
  window.addEventListener('mousemove', onResize)
  window.addEventListener('mouseup', stopResize)
}
function onResize(e) {
  let newWidth = startWidth - (e.clientX - startX) // т.к. тянем левый край
  newWidth = Math.min(800, Math.max(240, newWidth))
  drawerWidth.value = newWidth
}
function stopResize() {
  window.removeEventListener('mousemove', onResize)
  window.removeEventListener('mouseup', stopResize)
}
</script>

<style scoped>
.right-drawer {
  position: fixed;
  right: 0;
  top: 48px; /* высота хедера */
  bottom: 0;
  background: white;
  box-shadow: -2px 0 8px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  z-index: 30;
  transition: width 0.2s ease;
  border-left: 1px solid #ddd;
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f8f9fa;
  border-bottom: 1px solid #ddd;
}

.drawer-actions {
  display: flex;
  gap: 0.5rem;
}

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
}

.drawer-content {
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