<!-- components/construction/sections/tree-layout/RightDrawer.vue -->
<template>
  <!-- Триггер (всегда виден) -->
  <div class="panel-trigger" @click="isExpanded = true">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path 
        d="M15 18L9 12L15 6" 
        stroke="currentColor" 
        stroke-width="2" 
        stroke-linecap="round" 
        stroke-linejoin="round"
      />
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.5" fill="none"/>
    </svg>
    <span class="trigger-label">Редактор</span>
  </div>
  
  <!-- Парящая панель -->
  <Teleport to="body">
    <div 
      v-if="isExpanded"
      class="floating-panel"
      :style="{ 
        width: drawerWidth + 'px',
        top: panelTop + 'px',
        right: panelRight + 'px',
        height: panelHeight + 'px'
      }"
    >
      <div class="panel-header">
        <span class="panel-title">Редактор</span>
        <button class="panel-close" @click="isExpanded = false">✕</button>
      </div>
      
      <div class="panel-content">
        <slot>
          <div class="placeholder-content">
            <div class="info-section">
              <h4>Информация</h4>
              <p>Выберите персону для редактирования</p>
            </div>
            <div class="info-section">
              <h4>Свойства</h4>
              <p>Здесь будут отображаться свойства выбранного элемента</p>
            </div>
          </div>
        </slot>
      </div>
      
      <div class="resize-handle" @mousedown="startResize"></div>
    </div>
  </Teleport>
</template>

<script setup>
import { useLocalStorage } from '~/composables/useLocalStorage'

const isExpanded = ref(false)
const drawerWidth = useLocalStorage('right-drawer-width', 320)

const panelTop = ref(0)
const panelRight = ref(0)
const panelHeight = ref(0)

const updatePosition = () => {
  const mainEl = document.querySelector('.tree-main')
  if (!mainEl) return
  
  const rect = mainEl.getBoundingClientRect()
  panelTop.value = rect.top
  panelRight.value = window.innerWidth - rect.right
  panelHeight.value = rect.height
}

onMounted(() => {
  updatePosition()
  window.addEventListener('resize', updatePosition)
})

onUnmounted(() => {
  window.removeEventListener('resize', updatePosition)
})

// Ресайз
let startX, startWidth
function startResize(e) {
  e.preventDefault()
  startX = e.clientX
  startWidth = drawerWidth.value
  
  const onMove = (e) => {
    const delta = startX - e.clientX
    const newWidth = Math.min(600, Math.max(240, startWidth + delta))
    drawerWidth.value = newWidth
  }
  
  const onUp = () => {
    window.removeEventListener('mousemove', onMove)
    window.removeEventListener('mouseup', onUp)
  }
  
  window.addEventListener('mousemove', onMove)
  window.addEventListener('mouseup', onUp)
}
</script>

<style scoped>
/* Триггер */
.panel-trigger {
  width: 48px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 16px;
  gap: 6px;
  background: #f8fafc;
  border-left: 1px solid #e2e8f0;
  cursor: pointer;
  transition: background 0.15s;
  color: #64748b;
  flex-shrink: 0;
}

.panel-trigger:hover {
  background: #f1f5f9;
  color: #3b82f6;
}

.trigger-label {
  font-size: 11px;
  font-weight: 500;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  letter-spacing: 1px;
}

/* Парящая панель */
.floating-panel {
  position: fixed;
  background: #ffffff;
  box-shadow: -4px 0 16px rgba(0, 0, 0, 0.08);
  z-index: 100;
  display: flex;
  flex-direction: column;
  border-left: 1px solid #e2e8f0;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  flex-shrink: 0;
}

.panel-title {
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
}

.panel-close {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.15s;
}

.panel-close:hover {
  background: #e2e8f0;
  color: #0f172a;
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.placeholder-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-section {
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.info-section h4 {
  margin: 0 0 8px 0;
  color: #1e293b;
  font-size: 14px;
  font-weight: 600;
}

.info-section p {
  margin: 0;
  color: #64748b;
  font-size: 13px;
}

.resize-handle {
  position: absolute;
  left: -3px;
  top: 0;
  width: 6px;
  height: 100%;
  cursor: ew-resize;
  transition: background 0.15s;
}

.resize-handle:hover {
  background: #3b82f6;
}
</style>