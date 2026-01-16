<script setup>
const route = useRoute()
const content = ref(null)

const loadContent = async () => {
  try {
    const data = await import('~/components/db.json')
    // Берем текущий путь из URL (без /)
    const slug = route.path.substring(1) || 'home'
    content.value = data[slug] || null
  } catch {
    content.value = null
  }
}

onMounted(loadContent)
// Следим за изменением всего маршрута
watch(() => route.path, loadContent)
</script>


<template>

    <main class="main-content">

        <!-- СЛОТ ЗАГОЛОВКА -->
        <slot name="title">
            <h1 v-if="content?.title">{{ content.title }}</h1>
        </slot>
    
        <!-- СЛОТ КОНТЕНТА -->
        <slot name="content">
            <div v-if="content?.body" v-html="content.body" />
        </slot>
    
        <!-- ДЕФОЛТНЫЙ СЛОТ -->
        <slot />

    </main>

</template>


<style scoped>
/* Основной контент (центральная колонка) */
.main-content {
    padding: 2rem;
    /* background: rgba(255, 255, 255, 0.95); */
    border: 1px solid black;
    /* min-height: 100dhv; */
    flex-grow: 1; /* ← КЛЮЧЕВОЕ! Растягивает Main по ВЫСОТЕ */

  
}
    
</style>
