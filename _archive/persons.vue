<script setup>

const PageName = 'Персоны'

definePageMeta({
  layout: 'default',  
  title: PageName,  
  order: 3         
})


// const handleSubmit = async (data) => {
//   console.log('Данные формы:', data)
//   // Твой API вызов
// }

</script>

<template>
  <div class="page-content">
        <!-- СЛОТ ЗАГОЛОВКА -->
    <div name="title">
        <h1>{{PageName}}</h1>
    </div>



    <!-- Виджет формы -->
    <PersonFormWizard @submit="handleSubmit" />

    
  </div>
</template>


<style scoped>
</style>
