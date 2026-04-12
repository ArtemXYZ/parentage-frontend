<script setup>
const pageName = 'Дендрограмма'

definePageMeta({
  layout: 'tree-layout',  //  default
  title: pageName,
  order: 3
})

// Опционально: передать свои данные (когда появятся из API)
const myFamilyData = ref(null)

// Пример, как будут выглядеть данные из API (иерархия)
// const myFamilyData = {
//   name: "Род Кузнецовых",
//   children: [
//     { name: "Анна Кузнецова (1960)", type: "person", children: [...] }
//   ]
// }
</script>

<template>
  <div class="page-content">
    <div class="title-section">
      <h1>{{ pageName }}</h1>
      <p class="subtitle">Кластерная дендрограмма (иерархическое древо)</p>
    </div>

    <!-- Новый компонент дендрограммы -->
    <Dendrogram 
      :custom-data="myFamilyData"
      :margin-left="150"
      :margin-right="50"
    />
  </div>
</template>

<style scoped>
.page-content {
  padding: 20px;
  height: calc(100vh - 100px); /* Задаем высоту для контейнера */
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
}

/* Контейнер для графа занимает оставшееся место */
.dendrogram-tree {
  flex-grow: 1;
  min-height: 0;
}
</style>