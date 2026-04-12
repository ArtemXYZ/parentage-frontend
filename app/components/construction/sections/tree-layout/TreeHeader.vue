<!-- components/construction/sections/TreeHeader.vue -->
<template>
  <header class="tree-header">
    <div class="header-left">
      <span class="logo">Parentage</span>
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
    </div>
    <div class="header-right">
      <button class="icon-btn">🔔</button>
      <button class="icon-btn">👤</button>
    </div>
  </header>
</template>

<script setup>
// import { ref } from 'vue'

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
  // Закрываем все остальные
  menus.value.forEach(m => {
    if (m !== menu) m.open = false
  })
  menu.open = !menu.open
}

// Закрыть при клике вне (можно добавить глобальный слушатель)
</script>

<style scoped>
.tree-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
  background: #2c3e50;
  color: white;
  height: 48px;
  border-bottom: 1px solid #1a252f;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.logo {
  font-weight: bold;
  font-size: 1.2rem;
}

.menu-bar {
  display: flex;
  gap: 1rem;
}

.menu-item {
  position: relative;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
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
}

.dropdown div:hover {
  background: #3b5c7a;
}

.header-right {
  display: flex;
  gap: 0.5rem;
}

.icon-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1.2rem;
}
</style>