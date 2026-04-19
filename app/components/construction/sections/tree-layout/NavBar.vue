<!-- components/construction/NavBar.vue -->
<template>
  <div class="navbar-wrapper">
    <nav class="header-navigation">
      <div class="menu-bar">
        <div v-for="menu in menus" :key="menu.label" class="menu-item" @click="toggleMenu(menu)">
          {{ menu.label }}
          <div v-if="menu.open" class="dropdown">
            <div v-for="item in menu.items" :key="item.label" @click="item.action">
              {{ item.label }}
            </div>
          </div>
        </div>
      </div>
    </nav>

    <div v-if="tabsManager.openTabs.value.length > 0" class="tabs-bar">
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
  </div>
</template>

<script setup>
const tabsManager = inject('tabsManager')

const menus = ref([
  {
    label: 'Файл',
    open: false,
    items: [
      { label: 'Импорт GEDCOM', action: () => console.log('импорт') },
      { label: 'Экспорт', action: () => console.log('экспорт') },
      { label: 'Создать древо', action: () => console.log('новое древо') },
    ]
  },
  {
    label: 'Вид',
    open: false,
    items: [
      { label: 'Сбросить масштаб', action: () => console.log('сброс') },
      { label: 'Показать сетку', action: () => console.log('сетка') },
    ]
  },
  {
    label: 'Инструменты',
    open: false,
    items: [
      { label: 'Настройки', action: () => console.log('настройки') },
    ]
  }
])

function toggleMenu(menu) {
  menus.value.forEach(m => { if (m !== menu) m.open = false })
  menu.open = !menu.open
}

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
</script>

<style scoped>
.navbar-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.header-navigation {
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  width: 100%;
  height: 28px;
  padding: 3px 0px;
  border-bottom: 1px solid #2c3e50;
  align-items: center;
  justify-content: center;
  background: #1a252f;
}

.menu-bar {
  display: flex;
  gap: 1rem;
}

.menu-item {
  position: relative;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  color: #ecf0f1;
  font-size: 13px;
}

.menu-item:hover {
  background: #2c3e50;
  border-radius: 4px;
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  background: #34495e;
  border-radius: 4px;
  min-width: 180px;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

.dropdown div {
  padding: 0.5rem 1rem;
  cursor: pointer;
  color: #ecf0f1;
  font-size: 13px;
}

.dropdown div:hover {
  background: #3b5c7a;
}

/* Панель вкладок */
.tabs-bar {
  display: flex;
  align-items: center;
  height: 32px;
  background: #1e2a36;
  border-bottom: 1px solid #2c3e50;
  padding: 0 8px;
}

.tabs-container {
  display: flex;
  align-items: center;
  gap: 2px;
  flex: 1;
  overflow-x: auto;
  scrollbar-width: thin;
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
</style>