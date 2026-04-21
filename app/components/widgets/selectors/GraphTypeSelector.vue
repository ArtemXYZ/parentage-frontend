<!-- components/widgets/selectors/GraphTypeSelector.vue -->
<template>
  <div class="graph-type-selector">
    <div class="section-title">Виды</div>
    <div
      v-for="type in graphTypes"
      :key="type.id"
      class="type-item"
      :class="{ active: selectedType === type.id }"
      @click="selectType(type.id)"
    >
      <Icon :name="type.icon" class="type-icon" />
      <span>{{ type.label }}</span>
    </div>
  </div>
</template>

<script setup>
const graphTypes = [
  { id: 'dendrogram', label: 'Дендрограмма', icon: 'ph:tree-structure' },
  { id: 'radial', label: 'Радиальное', icon: 'ph:circle-half' },
  { id: 'force', label: 'Граф сил', icon: 'ph:graph' }
]

const selectedType = ref('dendrogram')
const emit = defineEmits(['change'])

const selectType = (id) => {
  selectedType.value = id
  emit('change', id)
}

defineExpose({ selectedType })
</script>

<style scoped>
.graph-type-selector {
  margin-top: 20px;
  border-top: 1px solid #bdc3c7;
  padding-top: 12px;
}
.section-title {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #64748b;
  margin-bottom: 8px;
  padding-left: 4px;
}
.type-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  margin: 2px 0;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  color: #2c3e50;
  transition: background 0.15s;
}
.type-item:hover {
  background: #e2e8f0;
}
.type-item.active {
  background: #dbeafe;
  color: #1e293b;
  font-weight: 500;
}
.type-icon {
  width: 18px;
  height: 18px;
  color: #64748b;
}
</style>