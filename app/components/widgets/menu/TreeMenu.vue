<!-- components/widgets/menu/TreeMenu.vue -->
<template>
  <div class="tree-menu">
    <div v-for="node in routesTree" :key="node.path" class="tree-node">
      <div
        class="tree-item"
        :style="{ paddingLeft: (level * 16 + 8) + 'px' }"
        @click="handleClick(node)"
      >
        <span v-if="node.children && node.children.length" class="toggle" @click.stop="toggle(node)">
          {{ node.expanded ? '▼' : '▶' }}
        </span>
        <span class="label">{{ node.label }}</span>
      </div>
      <div v-if="node.expanded && node.children">
        <TreeMenu :routes-tree="node.children" :level="level + 1" @navigate="$emit('navigate', $event)" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const props = defineProps({
  routesTree: Array,
  level: { type: Number, default: 0 }
})
const emit = defineEmits(['navigate'])

function toggle(node) {
  node.expanded = !node.expanded
}

function handleClick(node) {
  if (node.path) {
    navigateTo(node.path)
    emit('navigate', node.path)
  }
}
</script>

<style scoped>
.tree-menu {
  font-size: 0.9rem;
}
.tree-item {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 4px 0;
  border-radius: 4px;
}
.tree-item:hover {
  background: #d0d7de;
}
.toggle {
  width: 20px;
  cursor: pointer;
  user-select: none;
}
.label {
  margin-left: 4px;
}
</style>