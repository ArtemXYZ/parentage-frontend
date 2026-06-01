<!-- components/widgets/selectors/GraphTypeSwitcher.vue -->
<template>
  <div class="graph-type-switcher" ref="containerRef">
    <div class="icon-item" @click="toggleMenu">
      <Icon name="ph:tree-structure" class="dock-icon" />
      <span class="tooltip">Виды</span>
    </div>
    <div v-if="menuOpen" class="type-menu">
      <div
        v-for="type in graphTypes"
        :key="type.id"
        class="type-item"
        @click="selectType(type.id)"
      >
        <Icon :name="type.icon" class="type-icon" />
        <span>{{ type.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const graphTypes = [
  { id: 'dendrogram', label: 'Дендрограмма', icon: 'ph:tree-structure' },
  { id: 'radial', label: 'Радиальное', icon: 'ph:circle-half' },
  { id: 'force', label: 'Граф сил', icon: 'ph:graph' }
]

const menuOpen = ref(false)
const containerRef = ref(null)
const setGraphType = inject('setGraphType')

function toggleMenu() { menuOpen.value = !menuOpen.value }
function closeMenu() { menuOpen.value = false }
function selectType(type) {
  setGraphType?.(type)
  closeMenu()
}

function handleClickOutside(event) {
  if (containerRef.value && !containerRef.value.contains(event.target)) {
    closeMenu()
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>

<style scoped>
.graph-type-switcher { position: relative; }
.icon-item {
  width: 35px; height: 35px; display: flex; align-items: center; justify-content: center;
  cursor: pointer; border-radius: 8px; color: #bdc3c7; transition: background 0.2s;
}
.icon-item:hover { background: #2c3e50; color: #ffffff; }
.dock-icon { width: 22px; height: 22px; }
.tooltip {
  position: absolute; left: 60px; background: #34495e; color: white;
  padding: 4px 8px; border-radius: 4px; white-space: nowrap; opacity: 0;
  pointer-events: none; transition: opacity 0.2s;
}
.icon-item:hover .tooltip { opacity: 1; }
.type-menu {
  position: absolute; left: 48px; top: 0; background: #2c3e50;
  border-radius: 8px; padding: 4px 0; min-width: 160px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3); z-index: 100;
}
.type-item {
  display: flex; align-items: center; gap: 8px; padding: 6px 12px;
  color: #ecf0f1; font-size: 13px; cursor: pointer; transition: background 0.1s;
}
.type-item:hover { background: #3b5c7a; }
.type-icon { width: 18px; height: 18px; }
</style>