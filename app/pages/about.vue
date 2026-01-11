<script setup>
</script>

<template>
  <div class="layout-container">
    <NuxtLayout>  <!-- Всё, что здесь, попадёт в <slot /> лейаута -->
      
      <Header />
      <Main />
      <Footer />
      
    </NuxtLayout>
  </div>
</template>


<style scoped>
.layout-container {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
}
</style>
