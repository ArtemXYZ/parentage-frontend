<!-- components/widgets/overlays/FloatingPanelBlack.vue -->
<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      ref="panelRef"
      class="floating-panel"
      :style="{
        width: currentWidth + 'px',
        top: panelTop + 'px',
        right: panelRight + 'px',
        height: panelHeight + 'px'
      }"
    >
      <!-- Светлый заголовок с кнопками управления -->
      <div class="panel-header">
        <span class="panel-title">{{ title }}</span>
        <div class="panel-actions">
          <button class="panel-action" @click="minimize" title="Свернуть">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
          <button class="panel-action" @click="toggleMaximize" title="Развернуть">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M8 3H5C3.89543 3 3 3.89543 3 5V8M21 8V5C21 3.89543 20.1046 3 19 3H16M16 21H19C20.1046 21 21 20.1046 21 19V16M3 16V19C3 20.1046 3.89543 21 5 21H8"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
          <button class="panel-action" @click="close" title="Закрыть">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Панель вкладок в тёмном стиле NavBar (появляется только при наличии вкладок) -->
      <div v-if="tabsManager && tabsManager.openTabs.value.length" class="panel-tabs">
        <div class="tabs-container" ref="tabsContainer">
          <div
            v-for="(tab, index) in tabsManager.openTabs.value"
            :key="tab.id"
            class="tab-item"
            :class="{ active: tabsManager.activeTab.value === tab.id }"
            draggable="true"
            @click="tabsManager.setActiveTab(tab.id)"
            @dragstart="onDragStart($event, index)"
            @dragenter="onDragEnter($event, index)"
            @dragend="onDragEnd"
            @dragover.prevent
          >
            <span class="tab-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 4V20M20 12H4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </span>
            <span class="tab-label">{{ tab.title }}</span>
            <button class="tab-close" @click.stop="tabsManager.closeTab(tab.id)">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
        </div>
        <div class="tabs-actions">
          <button class="tab-action" @click="tabsManager.closeAllTabs" title="Закрыть все">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Контент активной вкладки (светлый) -->
      <div class="panel-content">
        <slot />
      </div>

      <div class="resize-handle" @mousedown="startResize"></div>
    </div>
  </Teleport>
</template>

<script setup>
import { useLocalStorage } from '~/composables/useLocalStorage'

const props = defineProps({
  isOpen: Boolean,
  title: String,
  containerRef: Object,
  defaultWidth: { type: Number, default: 380 },
  storageKey: { type: String, default: 'floating-panel-width' }
})

const emit = defineEmits(['update:isOpen', 'close'])

const tabsManager = inject('tabsManager', null)

const savedWidth = useLocalStorage(props.storageKey, props.defaultWidth)
const panelWidth = ref(savedWidth.value)
const isMaximized = ref(false)
const normalWidth = ref(savedWidth.value)

const currentWidth = computed(() => panelWidth.value)

const panelTop = ref(0)
const panelRight = ref(0)
const panelHeight = ref(0)

const close = () => {
  emit('update:isOpen', false)
  emit('close')
}

const minimize = () => {
  emit('update:isOpen', false)
}

const getMaxWidth = () => {
  const leftDock = document.querySelector('.left-dock')
  if (leftDock) {
    const leftRect = leftDock.getBoundingClientRect()
    return window.innerWidth - leftRect.right - 48
  }
  return window.innerWidth - 100
}

const toggleMaximize = () => {
  if (isMaximized.value) {
    panelWidth.value = normalWidth.value
    isMaximized.value = false
  } else {
    normalWidth.value = panelWidth.value
    panelWidth.value = getMaxWidth()
    isMaximized.value = true
  }
  savedWidth.value = panelWidth.value
}

const updatePosition = () => {
  if (!props.containerRef) return
  const rect = props.containerRef.getBoundingClientRect()
  panelTop.value = rect.top
  panelRight.value = window.innerWidth - rect.right
  panelHeight.value = rect.height
}

watch(() => props.isOpen, (open) => {
  if (open) {
    updatePosition()
    if (isMaximized.value) {
      panelWidth.value = getMaxWidth()
    }
  }
})

onMounted(() => {
  window.addEventListener('resize', () => {
    updatePosition()
    if (isMaximized.value) {
      panelWidth.value = getMaxWidth()
    }
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', updatePosition)
})

// Ресайз
let startX, startWidth
const startResize = (e) => {
  e.preventDefault()
  startX = e.clientX
  startWidth = panelWidth.value
  isMaximized.value = false

  const onMove = (e) => {
    const delta = startX - e.clientX
    let newWidth = startWidth + delta
    const maxWidth = getMaxWidth()
    newWidth = Math.min(maxWidth, Math.max(280, newWidth))
    panelWidth.value = newWidth
    savedWidth.value = newWidth
  }

  const onUp = () => {
    window.removeEventListener('mousemove', onMove)
    window.removeEventListener('mouseup', onUp)
  }

  window.addEventListener('mousemove', onMove)
  window.addEventListener('mouseup', onUp)
}

// Drag & drop вкладок
let draggedIndex = null
const onDragStart = (e, index) => {
  draggedIndex = index
  e.dataTransfer.effectAllowed = 'move'
}
const onDragEnter = (e, index) => {
  if (draggedIndex === null || draggedIndex === index) return
  const tabs = [...tabsManager.openTabs.value]
  const draggedTab = tabs[draggedIndex]
  tabs.splice(draggedIndex, 1)
  tabs.splice(index, 0, draggedTab)
  tabsManager.openTabs.value = tabs
  draggedIndex = index
}
const onDragEnd = () => { draggedIndex = null }

defineExpose({ close, minimize })
</script>

<style scoped>
/* Светлая панель в целом */
.floating-panel {
  position: fixed;
  background: #ffffff;
  box-shadow: -4px 0 16px rgba(0, 0, 0, 0.08);
  z-index: 100;
  display: flex;
  flex-direction: column;
  border-left: 1px solid #e2e8f0;
}

/* Светлый заголовок */
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  flex-shrink: 0;
}
.panel-title {
  font-size: 13px;
  font-weight: 500;
  color: #1e293b;
}
.panel-actions {
  display: flex;
  gap: 4px;
}
.panel-action {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 4px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.15s;
}
.panel-action:hover {
  background: #e2e8f0;
  color: #0f172a;
}

/* Тёмная панель вкладок (стили из NavBar) */
.panel-tabs {
  display: flex;
  align-items: center;
  background: #1e2a36;
  border-bottom: 4px solid #2c3e50;
  border-top: 4px solid #2c3e50;

  padding: 0 8px;
  height: 32px;
  flex-shrink: 0;
}

.tabs-container {
  display: flex;
  align-items: center;
  gap: 2px;
  flex: 1;
  overflow-x: auto;
  scrollbar-width: thin;
  height: 100%;
}
.tabs-container::-webkit-scrollbar {
  height: 2px;
}
.tabs-container::-webkit-scrollbar-thumb {
  background: #3b5c7a;
  border-radius: 2px;
}

.tab-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px 4px 10px;
  background: #2c3e50;
  border-radius: 4px 4px 0 0;
  font-size: 12px;
  color: #bdc3c7;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
  border-right: 1px solid #1a252f;
  user-select: none;
  max-width: 180px;
  height: 100%;
}
.tab-item:hover {
  background: #34495e;
}
.tab-item.active {
  background: #3b5c7a;
  color: #ffffff;
}
.tab-icon {
  display: flex;
  align-items: center;
  color: #5dade2;
}
.tab-label {
  overflow: hidden;
  text-overflow: ellipsis;
}
.tab-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  background: transparent;
  border: none;
  border-radius: 2px;
  color: #7f8c8d;
  cursor: pointer;
  padding: 0;
  margin-left: 2px;
}
.tab-close:hover {
  background: #5d6d7e;
  color: #ffffff;
}

.tabs-actions {
  display: flex;
  align-items: center;
  padding-left: 4px;
}

.tab-action {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 4px;
  color: #7f8c8d;
  cursor: pointer;
}
.tab-action:hover {
  background: #2c3e50;
  color: #ffffff;
}

/* Светлый контент */
.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: #ffffff;
  color: #1e293b;
}

/* Ручка ресайза */
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