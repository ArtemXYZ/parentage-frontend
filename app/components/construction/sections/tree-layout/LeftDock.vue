<!-- components/construction/sections/LeftDock.vue -->
<template>
  <div class="left-dock">
    <div class="icon-bar">
      <!-- Верхняя секция (функциональные) -->
      <div class="icon-section top">
        <div
          v-for="item in fixedTopItems"
          :key="item.id"
          class="icon-item"
          :class="{ active: activeIcon === item.id }"
          @click="toggleSlideout(item.id)"
        >
          <Icon :name="item.iconName" class="dock-icon" />
          <span class="tooltip">{{ item.label }}</span>
        </div>

        <!-- Разделитель перед страницами -->
        <div v-if="pageItems.length" class="icon-bar-divider"></div>

        <!-- Страницы из роутера -->
        <div
          v-for="page in pageItems"
          :key="page.id"
          class="icon-item"
          :class="{ active: activeIcon === page.id }"
          @click="toggleSlideout(page.id)"
        >
          <Icon :name="page.iconName" class="dock-icon" />
          <span class="tooltip">{{ page.label }}</span>
        </div>
      </div>

      <!-- Разделитель между верхней и нижней частью -->
      <div class="icon-bar-divider"></div>

      <!-- Нижняя секция (системные) -->
      <div class="icon-section bottom">
        <div
          v-for="item in bottomItems"
          :key="item.id"
          class="icon-item"
          :class="{ active: activeIcon === item.id }"
          @click="toggleBottomMenu(item.id, $event)"
        >
          <Icon :name="item.iconName" class="dock-icon" />
          <span class="tooltip">{{ item.label }}</span>
        </div>
      </div>
    </div>

    <!-- Контекстное меню для нижних иконок -->
    <Teleport to="body">
      <div
        v-if="contextMenu.visible"
        class="context-menu"
        :style="{ top: contextMenu.y + 'px', left: contextMenu.x + 'px' }"
        @click.stop
      >
        <div
          v-for="opt in contextMenu.options"
          :key="opt.label"
          class="context-menu-item"
          @click="opt.action"
        >
          <Icon :name="opt.icon" class="menu-item-icon" />
          <span>{{ opt.label }}</span>
        </div>
      </div>
    </Teleport>

    <!-- Выдвижная панель -->
    <transition name="slide">
      <div v-if="activeSlideout" class="slideout-panel" :style="{ width: slideoutWidth + 'px' }">
        <div class="slideout-header">
          <span class="panel-title">{{ currentSlideoutLabel }}</span>
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
          <template v-if="activeSlideout === 'tree'">
            <FamilyTreeMenu />
            <GraphTypeSelector @change="handleGraphTypeChange" />
          </template>
          <div v-else-if="activeSlideout === 'search'" class="placeholder-content">
            <Icon name="ph:magnifying-glass" class="placeholder-icon" />
            <p>Поиск по древу</p>
          </div>
          <div v-else class="placeholder-content">
            <Icon :name="currentPageIcon" class="placeholder-icon" />
            <p>{{ currentSlideoutLabel }}</p>
            <p style="font-size:12px; color: #64748b;">Содержимое появится позже</p>
          </div>
        </div>

        <div class="resize-handle" @mousedown="startResize"></div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import GraphTypeSelector from '~/components/widgets/selectors/GraphTypeSelector.vue'

const router = useRouter()

const fixedTopItems = [
  { id: 'tree', iconName: 'ph:git-branch', label: 'Древо' },
  { id: 'search', iconName: 'ph:magnifying-glass', label: 'Поиск' },
]

const bottomItems = [
  { id: 'settings', iconName: 'ph:gear', label: 'Настройки' },
  { id: 'account', iconName: 'ph:user-circle', label: 'Аккаунт' },
]

// Страницы с layout: 'tree-layout', исключая /tree
const pageItems = computed(() => {
  return router.getRoutes()
    .filter(route =>
      route.meta?.layout === 'tree-layout' &&
      route.name &&
      route.path !== '/tree'
    )
    .sort((a, b) => (a.meta?.order || 100) - (b.meta?.order || 100))
    .map(route => ({
      id: route.path,
      label: route.meta?.title || route.name,
      iconName: route.meta?.icon || 'ph:circle',
      path: route.path
    }))
})

const allItems = computed(() => [
  ...fixedTopItems,
  ...pageItems.value,
  ...bottomItems
])

const activeIcon = ref(null)
const activeSlideout = ref(null)
const slideoutWidth = useLocalStorage('left-slideout-width', 280)
const isMaximized = ref(false)
const normalWidth = ref(280)

const contextMenu = ref({
  visible: false,
  x: 0,
  y: 0,
  options: []
})

const currentSlideoutLabel = computed(() => {
  return allItems.value.find(i => i.id === activeSlideout.value)?.label || ''
})

const currentPageIcon = computed(() => {
  return allItems.value.find(i => i.id === activeSlideout.value)?.iconName || 'ph:circle'
})

const setGraphType = inject('setGraphType', null)

function handleGraphTypeChange(type) {
  setGraphType?.(type)
}

function toggleSlideout(id) {
  if (activeSlideout.value === id) {
    activeSlideout.value = null
    activeIcon.value = null
  } else {
    activeSlideout.value = id
    activeIcon.value = id
  }
  contextMenu.value.visible = false
}

function toggleBottomMenu(id, event) {
  event.stopPropagation()
  if (activeSlideout.value) {
    activeSlideout.value = null
    activeIcon.value = null
  }
  const rect = event.currentTarget.getBoundingClientRect()
  contextMenu.value.x = rect.right
  contextMenu.value.y = rect.top

  if (id === 'settings') {
    contextMenu.value.options = [
      { label: 'Общие настройки', icon: 'ph:sliders', action: () => console.log('Настройки') },
      { label: 'Тема оформления', icon: 'ph:paint-brush', action: () => console.log('Тема') },
    ]
  } else if (id === 'account') {
    contextMenu.value.options = [
      { label: 'Профиль', icon: 'ph:user', action: () => console.log('Профиль') },
      { label: 'Выйти', icon: 'ph:sign-out', action: () => console.log('Выйти') },
    ]
  }
  contextMenu.value.visible = true
  setTimeout(() => window.addEventListener('click', () => contextMenu.value.visible = false, { once: true }), 10)
}

function closeSlideout() {
  activeSlideout.value = null
  activeIcon.value = null
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
</script>

<style scoped>
/* все стили без изменений, как в предыдущей версии */
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
}
.icon-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}
.icon-section.top {
  padding-top: 1rem;
}
.icon-section.bottom {
  margin-top: auto;
  padding-bottom: 1rem;
}
.icon-bar-divider {
  width: 30px;
  height: 1px;
  background: #3b4a5a;
  margin: 12px 0;
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
.context-menu {
  position: fixed;
  background: #2c3e50;
  border-radius: 8px;
  padding: 4px 0;
  min-width: 180px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  z-index: 1000;
}
.context-menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  color: #ecf0f1;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.1s;
}
.context-menu-item:hover {
  background: #3b5c7a;
}
.menu-item-icon {
  width: 16px;
  height: 16px;
  color: #bdc3c7;
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