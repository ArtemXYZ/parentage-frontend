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
    
.content-container {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2% 5%;
  box-sizing: border-box;
}

.content__title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 700;
  line-height: 1.2;
  margin: 0 0 3% 0;
  text-align: center;
}

.content__text {
  font-size: clamp(1rem, 2.5vw, 1.125rem);
  line-height: 1.7;
}

/* Стили для вложенного контента внутри content__text */
.content__text :deep(h2) {
  font-size: 1.8rem;
  margin: 5% 0 2%;
}

.content__text :deep(h3) {
  font-size: 1.4rem;
  margin: 4% 0 2%;
}

.content__text :deep(p) {
  margin-bottom: 3%;
}

.content__text :deep(ul),
.content__text :deep(ol) {
  margin-bottom: 3%;
  padding-left: 5%;
}

.content__text :deep(li) {
  margin-bottom: 1%;
}

.content__text :deep(a) {
  color: #0066cc;
}

/* Адаптивность */
@media (max-width: 768px) {
  .content-container {
    width: 95%;
    padding: 4% 3%;
  }
  
  .content__title {
    margin-bottom: 5%;
  }
  
  .content__text :deep(p) {
    margin-bottom: 5%;
  }
}

@media (max-width: 480px) {
  .content-container {
    width: 98%;
    padding: 6% 2%;
  }
  
  .content__title {
    margin-bottom: 8%;
  }
  
  .content__text :deep(p) {
    margin-bottom: 8%;
  }
}
</style>
