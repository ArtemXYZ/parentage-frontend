<!-- components/widgets/menu/FamilyTreeNode.vue -->
<template>
  <div class="tree-node" :class="{ 'has-children': hasChildren, selected: isSelected }">
    <!-- Вертикальные линии -->
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
      @dblclick="handleDoubleClick"
    >
      <Icon
        v-if="hasChildren"
        :name="expanded ? 'ph:caret-down' : 'ph:caret-right'"
        class="expand-icon"
        @click.stop="toggleExpand"
      />
      <Icon v-else name="ph:circle" class="leaf-icon" />
      <Icon :name="genderIcon" class="node-icon" />
      <span class="node-label">{{ node.name }}</span>
      <Icon :name="personTypeIcon" class="type-icon" />
      <span v-if="node.birthYear" class="node-year">
        <Icon name="ph:calendar" class="year-icon" />
        {{ node.birthYear }}
      </span>
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
const selectedNodeId = inject('selectedNodeId')
const setSelectedNode = inject('setSelectedNode')

const clickHandler = new NodeClickHandler(tabsManager, openEditor)

const expanded = ref(props.node.expanded || false)
const hasChildren = computed(() => props.node.children?.length > 0)
const isSelected = computed(() => selectedNodeId?.value === props.node.id)

// Иконка пола
const genderIcon = computed(() => {
  return props.node.gender === 'female' ? 'ph:user-female' : 'ph:user'
})

// Иконка типа персоны по возрасту
const personTypeIcon = computed(() => {
  const year = props.node.birthYear
  if (!year) return 'ph:question'
  const age = new Date().getFullYear() - year
  if (age < 18) return 'ph:baby'
  if (age < 60) return 'ph:user-circle'
  return 'ph:user-gear'
})

function toggleExpand() {
  if (hasChildren.value) expanded.value = !expanded.value
}

function handleClick() {
  if (props.node.type !== 'person') return
  setSelectedNode?.(props.node.id)
  clickHandler.handleSingleClick(props.node)
}

function handleDoubleClick() {
  if (props.node.type !== 'person') return
  setSelectedNode?.(props.node.id)
  clickHandler.handleDoubleClick(props.node)
}
</script>

<style scoped>
.tree-node {
  position: relative;
  user-select: none;
}

.tree-node.selected > .node-content {
  background: #dbeafe;
  border-left: 3px solid #3b82f6;
}

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

.tree-line:nth-child(1) { left: 4px; }
.tree-line:nth-child(2) { left: 20px; }
.tree-line:nth-child(3) { left: 36px; }
.tree-line:nth-child(4) { left: 52px; }
.tree-line:nth-child(5) { left: 68px; }
.tree-line:nth-child(6) { left: 84px; }
.tree-line:nth-child(7) { left: 100px; }

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
  margin-right: 6px;
  color: #3b82f6;
  flex-shrink: 0;
}

.type-icon {
  width: 14px;
  height: 14px;
  margin-left: 6px;
  margin-right: 4px;
  color: #94a3b8;
  flex-shrink: 0;
}

.node-label {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.node-year {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: 4px;
  font-size: 11px;
  color: #64748b;
}

.year-icon {
  width: 12px;
  height: 12px;
}

.node-children {
  position: relative;
  padding-left: 0;
}
</style>