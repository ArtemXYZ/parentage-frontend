<!-- components/widgets/user/UserMenu.vue -->
<template>
  <div class="user-menu" ref="containerRef">
    <Icon name="ph:user-circle" class="user-icon" @click="toggleMenu" />
    <div v-if="menuOpen" class="menu-dropdown">
      <div class="menu-item" @click="goToProfile">Профиль</div>
      <div class="menu-item" @click="logout">Выйти</div>
    </div>
  </div>
</template>

<script setup>
const menuOpen = ref(false)
const containerRef = ref(null)

function toggleMenu() { menuOpen.value = !menuOpen.value }
function closeMenu() { menuOpen.value = false }
function goToProfile() { console.log('Переход в профиль'); closeMenu() }
function logout() { console.log('Выход'); closeMenu() }

function handleClickOutside(event) {
  if (containerRef.value && !containerRef.value.contains(event.target)) {
    closeMenu()
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>

<style scoped>
.user-menu { position: relative; }
.user-icon {
  width: 20px; height: 20px; cursor: pointer; color: #ecf0f1;
  transition: color 0.15s;
}
.user-icon:hover { color: #ffffff; }
.menu-dropdown {
  position: absolute; top: 100%; right: 0; margin-top: 8px;
  background: #2c3e50; border-radius: 8px; padding: 4px 0;
  min-width: 160px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); z-index: 100;
}
.menu-item {
  padding: 6px 12px; color: #ecf0f1; font-size: 13px; cursor: pointer;
  transition: background 0.1s;
}
.menu-item:hover { background: #3b5c7a; }
</style>