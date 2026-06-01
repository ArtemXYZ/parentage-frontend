<!-- components/construction/sections/LeftDock.vue -->
<template>
  <div class="left-dock">
    <div class="icon-bar">
      <!-- Иконка "Древо" -->
      <div
        class="icon-item"
        :class="{ active: activeSlideout === 'tree' }"
        @click="toggleSlideout('tree')"
      >
        <Icon name="ph:git-branch" class="dock-icon" />
        <span class="tooltip">Древо</span>
      </div>

      <!-- Иконка "Виды" с раскрытием вниз -->
      <div class="graph-type-switcher" ref="switcherRef">
        <div
          class="icon-item"
          :class="{ active: menuOpen }"
          @click="toggleMenu"
        >
          <Icon name="ph:tree-structure" class="dock-icon" />
          <span class="tooltip">Виды</span>
        </div>

        <!-- Меню выбора вида (раскрывается вниз, с иконками) -->
        <div v-if="menuOpen" class="type-menu">
          <div
            v-for="(type, index) in graphTypes"
            :key="type.id"
            class="type-item"
            :class="{ 'with-divider': index < graphTypes.length - 1 }"
            @click="selectType(type.id)"
          >
            <Icon :name="type.icon" class="type-icon" />
            <span class="tooltip-right">{{ type.label }}</span>
          </div>
        </div>
      </div>

      <!-- Здесь могут быть другие иконки (будут сдвинуты вниз при раскрытии меню) -->
    </div>

    <!-- Выдвижная панель для Древа -->
    <transition name="slide">
      <div v-if="activeSlideout === 'tree'" class="slideout-panel" :style="{ width: slideoutWidth + 'px' }">
        <div class="slideout-header">
          <span class="panel-title">Древо</span>
          <div class="panel-actions">
            <button class="panel-action" @click="minimizePanel" title="Свернуть">
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
            <button class="panel-action" @click="closeSlideout" title="Закрыть">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="slideout-content">
          <FamilyTreeMenu />
        </div>

        <div class="resize-handle" @mousedown="startResize"></div>
      </div>
    </transition>
  </div>
</template>

<script setup>
const graphTypes = [
  { id: 'dendrogram', label: 'Дендрограмма', icon: 'ph:tree-structure' },
  { id: 'radial', label: 'Радиальное', icon: 'ph:circle-half' },
  { id: 'force', label: 'Граф сил', icon: 'ph:graph' }
]

const activeSlideout = ref(null)
const slideoutWidth = useLocalStorage('left-slideout-width', 280)
const isMaximized = ref(false)
const normalWidth = ref(280)

const menuOpen = ref(false)
const switcherRef = ref(null)
const setGraphType = inject('setGraphType')

function toggleSlideout(id) {
  activeSlideout.value = activeSlideout.value === id ? null : id
}
function closeSlideout() {
  activeSlideout.value = null
}
function minimizePanel() {
  closeSlideout()
}

function getMaxWidth() {
  const mainEl = document.querySelector('.tree-main')
  return mainEl ? mainEl.clientWidth - 40 : 600
}
function toggleMaximize() {
  if (isMaximized.value) {
    slideoutWidth.value = normalWidth.value
    isMaximized.value = false
  } else {
    normalWidth.value = slideoutWidth.value
    slideoutWidth.value = getMaxWidth()
    isMaximized.value = true
  }
}

let startX, startWidth
function startResize(e) {
  e.preventDefault()
  startX = e.clientX
  startWidth = slideoutWidth.value
  window.addEventListener('mousemove', onResize)
  window.addEventListener('mouseup', stopResize)
}
function onResize(e) {
  let newWidth = startWidth + (e.clientX - startX)
  newWidth = Math.min(600, Math.max(180, newWidth))
  slideoutWidth.value = newWidth
  isMaximized.value = false
}
function stopResize() {
  window.removeEventListener('mousemove', onResize)
  window.removeEventListener('mouseup', stopResize)
}

// Меню "Виды"
function toggleMenu() {
  menuOpen.value = !menuOpen.value
}
function closeMenu() {
  menuOpen.value = false
}
function selectType(type) {
  setGraphType?.(type)
  closeMenu()
}
function handleClickOutside(event) {
  if (switcherRef.value && !switcherRef.value.contains(event.target)) {
    closeMenu()
  }
}
onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
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
  height: 100%;
  padding-top: 1rem;
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

/* Меню видов (раскрывается вниз) */
.graph-type-switcher {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.type-menu {
  width: 100%;
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 4px 0 8px 0;
}

.type-item {
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
.type-item:hover {
  background: #2c3e50;
  color: #ffffff;
}
.type-item.with-divider::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 10%;
  width: 80%;
  height: 1px;
  background: #3b4a5a;
}

.type-icon {
  width: 22px;
  height: 22px;
}

.tooltip-right {
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
  z-index: 30;
}
.type-item:hover .tooltip-right {
  opacity: 1;
}

/* Выдвижная панель */
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

.slideout-content {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem;
}

.resize-handle {
  position: absolute;
  right: -3px;
  top: 0;
  width: 6px;
  height: 100%;
  cursor: ew-resize;
  background: transparent;
  transition: background 0.15s;
  z-index: 30;
}
.resize-handle:hover {
  background: rgba(59, 130, 246, 0.3);
}

.slide-enter-active, .slide-leave-active {
  transition: transform 0.2s ease;
}
.slide-enter-from, .slide-leave-to {
  transform: translateX(-100%);
}
</style>