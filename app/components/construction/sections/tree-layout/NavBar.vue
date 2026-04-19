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
  </div>
</template>

<script setup>
const menus = ref([
  { label: 'Файл', open: false, items: [
    { label: 'Импорт GEDCOM', action: () => console.log('импорт') },
    { label: 'Экспорт', action: () => console.log('экспорт') },
    { label: 'Создать древо', action: () => console.log('новое древо') }
  ]},
  { label: 'Вид', open: false, items: [
    { label: 'Сбросить масштаб', action: () => console.log('сброс') },
    { label: 'Показать сетку', action: () => console.log('сетка') }
  ]},
  { label: 'Инструменты', open: false, items: [
    { label: 'Настройки', action: () => console.log('настройки') }
  ]}
])

function toggleMenu(menu) {
  menus.value.forEach(m => { if (m !== menu) m.open = false })
  menu.open = !menu.open
}
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
  height: 35px;
  padding: 3px 0px;
  border-bottom: 1px solid #2c3e50;
  align-items: center;
  justify-content: center;
  background: #1e2a36;
}
.menu-bar { display: flex; gap: 1rem; }
.menu-item {
  position: relative;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  color: #ecf0f1;
  font-size: 13px;
}
.menu-item:hover { background: #2c3e50; border-radius: 4px; }
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
.dropdown div:hover { background: #3b5c7a; }
</style>