<script setup>
// Формирует заголовок страницы 
// useHead({
//   title: 'My App',
//   meta: [
//     { name: 'description', content: 'My amazing site.' },
//   ],
//   bodyAttrs: {
//     class: 'test',
//   },
//   script: [{ innerHTML: 'console.log(\'Hello world\')' }],
// })

definePageMeta({
layout: 'default'
// title: 'Some Page'
})

const route = useRoute()
const content = ref(null)

const loadContent = async () => {
  try {
    // const data = await import('~/components/db.json')
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
  <div class="page-content">

    <!-- СЛОТ ЗАГОЛОВКА -->
    <div name="title">
        <h1 v-if="content?.title">{{ content.title }}</h1>

        <h1>Добро пожаловать в Parentage</h1>
    </div>

    <!-- СЛОТ КОНТЕНТА -->
    <div name="content">
        <div v-if="content?.body" v-html="content.body" />
    </div>



  </div>
</template>


<style scoped>
.page-content {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
}
</style>
