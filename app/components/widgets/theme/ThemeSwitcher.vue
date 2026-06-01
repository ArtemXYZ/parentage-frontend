<template>
  <Icon :name="currentIcon" class="theme-icon" @click="toggleTheme" />
</template>

<script setup>
const isDark = ref(true) // заглушка
const currentIcon = computed(() => isDark.value ? 'ph:moon' : 'ph:sun')
function toggleTheme() {
  isDark.value = !isDark.value
  console.log('Тема:', isDark.value ? 'тёмная' : 'светлая')
}
</script>

<style scoped>
.theme-icon {
  width: 20px; height: 20px; cursor: pointer; color: #ecf0f1;
  transition: color 0.15s;
}
.theme-icon:hover { color: #ffffff; }
</style>