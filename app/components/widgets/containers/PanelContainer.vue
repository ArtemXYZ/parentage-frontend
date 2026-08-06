<!-- components/widgets/containers/PanelContainer.vue -->
<template>
  <div
    class="panel-container"
    :class="[
      `panel-${direction}`,
      { collapsed: isCollapsed }
    ]"
    :style="panelStyle"
  >
    <!-- Заголовок -->
    <div v-if="!isCollapsed" class="panel-header" @dblclick="toggleCollapse">
      <span class="panel-title">{{ title }}</span>
      <button class="panel-collapse-btn" @click="toggleCollapse">
        <Icon :name="collapseIcon" size="14" />
      </button>
    </div>

    <!-- Контент -->
    <div v-if="!isCollapsed" class="panel-content">
      <slot />
    </div>

    <!-- Кнопка раскрытия (когда свёрнуто) -->
    <div v-if="isCollapsed" class="panel-collapsed-bar" @click="toggleCollapse">
      <Icon :name="expandIcon" size="14" />
      <span class="collapsed-label">{{ title }}</span>
    </div>

    <!-- Ручка ресайза -->
    <div
      v-if="!isCollapsed"
      class="resize-handle"
      :class="`handle-${resizeDirection}`"
      @mousedown="startResize"
    ></div>
  </div>
</template>

<script setup>
import { useLocalStorage } from '~/composables/useLocalStorage'

const props = defineProps({
  direction: {
    type: String,
    default: 'left',
    validator: (v) => ['left', 'right', 'bottom', 'center'].includes(v)
  },
  title: { type: String, default: '' },
  defaultSize: { type: Number, default: 300 },
  minSize: { type: Number, default: 100 },
  maxSize: { type: Number, default: 800 },
  storageKey: { type: String, default: '' },
  noCollapse: { type: Boolean, default: false }
})

const isCollapsed = ref(false)
const savedSize = props.storageKey
  ? useLocalStorage(props.storageKey, props.defaultSize)
  : ref(props.defaultSize)
const currentSize = ref(savedSize.value)

const collapseIcon = computed(() => {
  const icons = {
    left: 'ph:caret-left',
    right: 'ph:caret-right',
    bottom: 'ph:caret-down',
    center: 'ph:caret-up'
  }
  return icons[props.direction]
})

const expandIcon = computed(() => {
  const icons = {
    left: 'ph:caret-right',
    right: 'ph:caret-left',
    bottom: 'ph:caret-up',
    center: 'ph:caret-down'
  }
  return icons[props.direction]
})

const resizeDirection = computed(() => {
  const dirs = { left: 'right', right: 'left', bottom: 'top', center: 'bottom' }
  return dirs[props.direction]
})

const panelStyle = computed(() => {
  if (['left', 'right'].includes(props.direction)) {
    return {
      width: isCollapsed.value ? '32px' : `${currentSize.value}px`,
      minWidth: isCollapsed.value ? '32px' : `${props.minSize}px`,
      maxWidth: `${props.maxSize}px`
    }
  }
  if (props.direction === 'bottom') {
    return {
      height: isCollapsed.value ? '32px' : `${currentSize.value}px`,
      minHeight: isCollapsed.value ? '32px' : `${props.minSize}px`,
      maxHeight: `${props.maxSize}px`
    }
  }
  return { flex: 1 }
})

function toggleCollapse() {
  if (props.noCollapse) return
  isCollapsed.value = !isCollapsed.value
}

// Ресайз
let startCoord, startSize
function startResize(e) {
  e.preventDefault()
  const isHorizontal = ['left', 'right'].includes(props.direction)
  startCoord = isHorizontal ? e.clientX : e.clientY
  startSize = currentSize.value

  window.addEventListener('mousemove', onResize)
  window.addEventListener('mouseup', stopResize)
}

function onResize(e) {
  const isHorizontal = ['left', 'right'].includes(props.direction)
  const currentCoord = isHorizontal ? e.clientX : e.clientY
  let delta = currentCoord - startCoord

  // Инвертируем для левой и верхней панелей
  if (['left', 'bottom'].includes(props.direction)) {
    delta = -delta
  }

  let newSize = startSize + delta
  newSize = Math.min(props.maxSize, Math.max(props.minSize, newSize))
  currentSize.value = newSize
  savedSize.value = newSize
}

function stopResize() {
  window.removeEventListener('mousemove', onResize)
  window.removeEventListener('mouseup', stopResize)
}
</script>

<style scoped>
.panel-container {
  display: flex;
  flex-direction: column;
  background: #1e1e2e;
  position: relative;
  transition: width 0.15s ease, height 0.15s ease;
  overflow: hidden;
}

.panel-collapsed-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  cursor: pointer;
  color: #6c6c8a;
  background: #252540;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  gap: 6px;
  font-size: 11px;
  transition: background 0.15s;
}

.panel-collapsed-bar:hover {
  background: #2e2e50;
  color: #a0a0c0;
}

.collapsed-label {
  letter-spacing: 1px;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 32px;
  min-height: 32px;
  padding: 0 12px;
  background: #252540;
  border-bottom: 1px solid #1a1a2e;
  cursor: pointer;
  user-select: none;
}

.panel-title {
  font-size: 12px;
  font-weight: 500;
  color: #a0a0c0;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.panel-collapse-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background: transparent;
  border: none;
  border-radius: 4px;
  color: #6c6c8a;
  cursor: pointer;
  transition: all 0.15s;
}

.panel-collapse-btn:hover {
  background: #35355a;
  color: #c0c0e0;
}

.panel-content {
  flex: 1;
  overflow: auto;
  background: #1e1e2e;
}

/* Ручки ресайза */
.resize-handle {
  position: absolute;
  z-index: 10;
  transition: background 0.15s;
}

.handle-right {
  right: 0;
  top: 0;
  width: 3px;
  height: 100%;
  cursor: ew-resize;
}

.handle-left {
  left: 0;
  top: 0;
  width: 3px;
  height: 100%;
  cursor: ew-resize;
}

.handle-top {
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  cursor: ns-resize;
}

.handle-bottom {
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  cursor: ns-resize;
}

.resize-handle:hover {
  background: rgba(100, 100, 255, 0.3);
}
</style>