<!-- components/widgets/overlays/FloatingPanel.vue -->
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

// Получение максимальной ширины (до левого меню)
const getMaxWidth = () => {
  const leftDock = document.querySelector('.left-dock')
  
  if (leftDock) {
    const leftRect = leftDock.getBoundingClientRect()
    // От правого края экрана до правого края левого меню
    // минус ширина триггера (48px) и небольшой отступ
    return window.innerWidth - leftRect.right - 48
  }
  
  // Если не нашли левое меню
  return window.innerWidth - 100
}

const toggleMaximize = () => {
  if (isMaximized.value) {
    // Возвращаем нормальную ширину
    panelWidth.value = normalWidth.value
    isMaximized.value = false
  } else {
    // Сохраняем текущую ширину
    normalWidth.value = panelWidth.value
    // Разворачиваем до максимума
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
    // Если была развёрнута - применяем максимальную ширину
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
    
    // Ограничения
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

defineExpose({ close, minimize })
</script>

<style scoped>
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

.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
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