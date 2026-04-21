<!-- components/widgets/menu/FamilyTreeMenu.vue -->
<template>
  <div class="family-tree-menu">
    <div v-for="root in treeData" :key="root.id">
      <FamilyTreeNode :node="root" :level="0" />
    </div>
  </div>
</template>

<script setup>
import { familyTreeData } from '~/mocks/familyData'
const treeData = ref(familyTreeData)
</script>

<style scoped>
.family-tree-menu {
  padding: 8px 0;
  font-size: 13px;
}
</style>