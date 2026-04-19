<!-- components/widgets/menu/FamilyTreeNode.vue -->
<template>
  <div class="tree-node" :class="{ 'has-children': hasChildren }">
    <!-- Вертикальные линии (как в PyCharm) -->
    <div v-if="level > 0" class="tree-lines">
      <div
        v-for="i in level"
        :key="i"
        class="tree-line"
        :class="{ 'last-child': i === level && !hasChildren }"
      ></div>
    </div>

    <div
      class="node-content"
      :style="{ paddingLeft: level * 16 + 8 + 'px' }"
      @click="handleClick"
    >
      <Icon
        v-if="hasChildren"
        :name="expanded ? 'ph:caret-down' : 'ph:caret-right'"
        class="expand-icon"
        @click.stop="toggleExpand"
      />
      <Icon v-else name="ph:circle" class="leaf-icon" />
      <Icon name="ph:user" class="node-icon" />
      <span class="node-label">{{ node.name }}</span>
      <span v-if="node.birthYear" class="node-year">{{ node.birthYear }}</span>
    </div>
    <div v-if="expanded && hasChildren" class="node-children">
      <FamilyTreeNode
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :level="level + 1"
      />
    </div>
  </div>
</template>

<script setup>
import { NodeClickHandler } from '~/utils/NodeClickHandler'

const props = defineProps({
  node: { type: Object, required: true },
  level: { type: Number, default: 0 }
})

const tabsManager = inject('tabsManager')
const openEditor = inject('openEditor')
const clickHandler = new NodeClickHandler(tabsManager, openEditor)

const expanded = ref(props.node.expanded || false)
const hasChildren = computed(() => props.node.children?.length > 0)

function toggleExpand() {
  if (hasChildren.value) {
    expanded.value = !expanded.value
  }
}

function handleClick() {
  // Клик по узлу открывает редактор (как на графике)
  if (props.node.type === 'person') {
    clickHandler.handlePersonClick(props.node)
  }
}
</script>

<style scoped>
.tree-node {
  position: relative;
  user-select: none;
}

/* Вертикальные линии */
.tree-lines {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 20px;
  pointer-events: none;
}

.tree-line {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  background: #cbd5e1;
}

/* Смещение линий в зависимости от уровня */
.tree-line:nth-child(1) { left: 4px; }
.tree-line:nth-child(2) { left: 20px; }
.tree-line:nth-child(3) { left: 36px; }
.tree-line:nth-child(4) { left: 52px; }
.tree-line:nth-child(5) { left: 68px; }
.tree-line:nth-child(6) { left: 84px; }
.tree-line:nth-child(7) { left: 100px; }

/* Горизонтальная линия перед иконкой */
.node-content {
  display: flex;
  align-items: center;
  padding: 4px 8px 4px 0;
  cursor: pointer;
  border-radius: 4px;
  margin: 1px 4px;
  color: #2c3e50;
  position: relative;
}
.node-content::before {
  content: '';
  position: absolute;
  left: -8px;
  top: 50%;
  width: 12px;
  height: 1px;
  background: #cbd5e1;
  display: none;
}
.tree-node:not(:last-child) > .node-content::before {
  display: block;
}

.node-content:hover {
  background: #e2e8f0;
}

.expand-icon,
.leaf-icon {
  width: 16px;
  height: 16px;
  margin-right: 4px;
  color: #64748b;
  flex-shrink: 0;
  cursor: pointer;
}
.leaf-icon {
  opacity: 0.5;
}

.node-icon {
  width: 16px;
  height: 16px;
  margin-right: 8px;
  color: #3b82f6;
  flex-shrink: 0;
}

.node-label {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.node-year {
  margin-left: 8px;
  font-size: 11px;
  color: #94a3b8;
}

.node-children {
  position: relative;
  padding-left: 0;
}
</style>