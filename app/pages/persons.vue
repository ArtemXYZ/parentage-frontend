<script setup>


definePageMeta({
  layout: 'default',  
  title: 'Персоны',  // Кастомное название для меню
  order: 3         // Опционально: порядок в меню
})


const handleSubmit = async (data) => {
  console.log('Данные формы:', data)
  // Твой API вызов
}

</script>

<template>
  <div class="page-content">
        <!-- СЛОТ ЗАГОЛОВКА -->
    <div name="title">
        <h1>Персоны</h1>
    </div>



    <!-- Виджет формы -->
    <PersonFormWizard @submit="handleSubmit" />

    
  </div>
</template>


<style scoped>
</style>
