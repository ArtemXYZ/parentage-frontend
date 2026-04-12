<script setup>
const pageName = 'Древо'

definePageMeta({
  layout: 'tree-layout',  //  default
  title: pageName,
  order: 3
})

// Выбор типа визуализации: 'force', 'dendrogram', 'radial'
const viewType = ref('radial') // По умолчанию радиальное дерево

// Опционально: передать свои данные (когда появятся из API)
const myFamilyData = ref(null)

// Функция для смены типа отображения
const changeView = (type) => {
  viewType.value = type
}
</script>

<template>
  <div class="page-content">
    <div class="title-section">
      <h1>{{ pageName }}</h1>
      <p class="subtitle">Выберите тип визуализации</p>
      
      <!-- Кнопки переключения видов -->
      <div class="view-buttons">
        <button @click="changeView('force')" :class="{ active: viewType === 'force' }">
          Силовой граф
        </button>
        <button @click="changeView('dendrogram')" :class="{ active: viewType === 'dendrogram' }">
          Дендрограмма
        </button>
        <button @click="changeView('radial')" :class="{ active: viewType === 'radial' }">
          Радиальное дерево
        </button>
      </div>
    </div>

    <!-- Условный рендеринг выбранного компонента -->
    <ForceDirectedGraph 
      v-if="viewType === 'force'"
      :custom-data="myFamilyData"
    />
    
    <Dendrogram 
      v-else-if="viewType === 'dendrogram'"
      :custom-data="myFamilyData"
    />
    
    <RadialTree 
      v-else
      :custom-data="myFamilyData"
      :radius="500"
      :margin="60"
    />
  </div>
</template>

<style scoped>
.page-content {
  padding: 20px;
  height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
}

.title-section {
  margin-bottom: 20px;
  flex-shrink: 0;
}

.title-section h1 {
  font-size: 28px;
  color: #2c3e50;
  margin-bottom: 8px;
}

.subtitle {
  color: #7f8c8d;
  font-size: 14px;
  margin-bottom: 15px;
}

.view-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.view-buttons button {
  padding: 8px 16px;
  background: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}

.view-buttons button:hover {
  background: #e0e0e0;
  transform: translateY(-1px);
}

.view-buttons button.active {
  background: #4a90e2;
  color: white;
  border-color: #4a90e2;
}

/* Контейнер для графа занимает оставшееся место */
:deep(.force-directed-tree),
:deep(.dendrogram-tree),
:deep(.radial-tree) {
  flex-grow: 1;
  min-height: 0;
}
</style>