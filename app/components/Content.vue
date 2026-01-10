<script setup>
</script>


<template>

    <main class="main-content">
        <h1>Добро пожаловать в Parentage</h1>
        <p>Ваш контент здесь...</p>
        <!-- Просто контейнер без динамического контента -->
        <slot />
    </main>

</template>


<style scoped>
/* Основной контент (центральная колонка) */
.main-content {
  flex: 0.7; /* 70% от content-area  0.7*/ 
  padding: 2rem;
  /* background: rgba(255, 255, 255, 0.95); */
  border: 1px solid black;
  min-height: 100hv;
  
}
    
</style>
