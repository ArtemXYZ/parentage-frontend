<script setup>

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


</script>

<template>

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

</template>

<style scoped>

.header-navigation {
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  width: 100%;
  height: 28px;
    /* Внешние отступы */
  padding: 3px 0px;
  border: 1px solid black;
    /* Центрирование содержимого по вертикали */
  align-items: center;

  /* Центрирование содержимого по горизонтали */
  justify-content: center;
  /* justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  max-width: 1200px;
  margin: 0 auto; */
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



</style>