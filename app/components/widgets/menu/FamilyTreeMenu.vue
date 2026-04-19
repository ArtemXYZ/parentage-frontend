<!-- components/widgets/menu/FamilyTreeMenu.vue -->
<template>
  <div class="family-tree-menu">
    <div v-for="root in treeData" :key="root.id">
      <FamilyTreeNode :node="root" :level="0" />
    </div>
  </div>
</template>

<script setup>
// Моковые данные с добавленным type: 'person'
const treeData = ref([
  {
    id: 'ivan',
    name: 'Иван Петров',
    type: 'person',
    birthYear: 1950,
    expanded: true,
    children: [
      {
        id: 'alexey',
        name: 'Алексей Иванов',
        type: 'person',
        birthYear: 1975,
        expanded: false,
        children: [
          { id: 'dmitry', name: 'Дмитрий Алексеев', type: 'person', birthYear: 2000 },
          { id: 'anna', name: 'Анна Алексеева', type: 'person', birthYear: 2002 }
        ]
      },
      {
        id: 'sergey',
        name: 'Сергей Петров',
        type: 'person',
        birthYear: 1970,
        children: [
          { id: 'olga', name: 'Ольга Сергеева', type: 'person', birthYear: 1995 }
        ]
      }
    ]
  },
  {
    id: 'maria',
    name: 'Мария Иванова',
    type: 'person',
    birthYear: 1955,
    expanded: true,
    children: [
      { id: 'elena', name: 'Елена Иванова', type: 'person', birthYear: 1978 }
    ]
  }
])
</script>

<style scoped>
.family-tree-menu {
  padding: 8px 0;
  font-size: 13px;
}
</style>