<!-- layouts/tree-layout.vue -->
<template>

  <div class="tree-layout">
    
    <HeaderMini />
    <NavBar /> 

    <!-- АНИМАЦИЮ ПЛАВНУЮ, НОРМАЛЬНЫЕ ИКОНКИ, РАСКРЫТИЕ, ПОДСКАЗКИ  -->
    <main class="tree-main">
      <LeftDock />

      <!-- Доработать фон - добавить сетку -->
      <div class="canvas-container">
        <slot /> <!-- Здесь будет страница с TreeCanvas или напрямую компонент графа -->
      </div>

      <RightDrawer />
    </main>

    <FooterMini />
  </div>
</template>

<script setup>
</script>

<style scoped>
.tree-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
}

.tree-main {
  display: flex;
  flex: 1;
  position: relative;
  overflow: hidden; /* Чтобы панели не вылезали */
}

.canvas-container {
  flex: 1;
  position: relative;
  background: #f5f5f5; /* или цвет подложки */
  overflow: hidden;
}
</style>