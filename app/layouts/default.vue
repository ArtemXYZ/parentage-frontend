<script setup>
</script>

<template>

<div class="layout">

    <Header />

    <main class="site-main">

        <Nav />
        
        <div class="main-content">
          <slot />
        </div>

        <Sidebar />

    </main>

    <Footer />

  </div>

</template>


<style>


/* .app-container бывший */
.layout { 
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
}

/* Содержит Nav, Content, Sidebar */
.site-main {
  display: flex;
  flex-direction: row;    /* Nav, Content, Sidebar - в строку */
  flex: 1;
  /* Зачем: Чтобы padding и border включались в расчёт размеров элемента. */
  box-sizing: border-box;
  background: rgb(180, 226, 43);
}

/* Основной контент (центральная колонка) */
.main-content {
  padding: 2rem;
  /* background: rgba(255, 255, 255, 0.95); */
  border: 1px solid black;
  flex: 1;
}

</style>
