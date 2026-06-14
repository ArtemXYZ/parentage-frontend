<!-- components/construction/sections/LeftDock.vue -->
 
<!-- Разделить по ответственности  раздробить функционал! -->
<template>

  
  <div class="left-dock">
    <div class="icon-bar">
      <!-- Функциональная кнопка (стрелочка) -->
      <div class="icon-section top">
        <div
          class="icon-item"
          :class="{ active: activeSlideout === 'tree' }"
          @click="toggleSlideout('tree')"
        >
          <Icon name="ph:git-branch" class="dock-icon" />
          <span class="tooltip">Древо</span>
        </div>
      </div>

      <!-- Разделитель -->
      <div class="icon-bar-divider"></div>

      <!-- Навигационные иконки страниц -->
      <div class="icon-section nav">
        <div
          v-for="page in pageItems"
          :key="page.id"
          class="icon-item"
          :class="{ active: isCurrentPage(page.path) }"
          @click="navigateTo(page.path)"
        >
          <Icon :name="page.iconName" class="dock-icon" />
          <span class="tooltip">{{ page.label }}</span>
        </div>
      </div>
    </div>

    <!-- Выдвижная панель -->
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
const router = useRouter()
const route = useRoute()

const pageItems = computed(() => {
  return router.getRoutes()
    .filter(r => r.meta?.layout === 'tree-layout' && r.name)
    .sort((a, b) => (a.meta?.order || 100) - (b.meta?.order || 100))
    .map(r => ({
      id: r.path,
      label: r.meta?.title || r.name,
      iconName: r.meta?.icon || 'ph:circle',
      path: r.path
    }))
})

const isCurrentPage = (path) => route.path === path
const navigateTo = (path) => router.push(path)

const activeSlideout = ref(null)
const slideoutWidth = useLocalStorage('left-slideout-width', 280)
const isMaximized = ref(false)
const normalWidth = ref(280)

function toggleSlideout(id) {
  activeSlideout.value = activeSlideout.value === id ? null : id
}
function closeSlideout() { activeSlideout.value = null }
function minimizePanel() { closeSlideout() }

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

.icon-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
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

.icon-bar-divider {
  width: 30px;
  height: 1px;
  background: #3b4a5a;
  margin: 12px 0;
}

/* выдвижная панель */
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