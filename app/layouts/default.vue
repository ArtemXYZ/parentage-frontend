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

.site-main {
  display: flex;
  flex-direction: row;    /* Nav, Content, Sidebar - в строку */
  /* flex-grow: 1;  */
  /* ← КЛЮЧЕВОЕ! Растягивает Main по ВЫСОТЕ */
  flex: 1;
  /* Зачем: Чтобы padding и border включались в расчёт размеров элемента. */
  box-sizing: border-box;

  /* top: 0; */
  /* bottom: 0; */
  background: rgb(180, 226, 43);

  /* height: 100%; */
  /* min-height: 100dvh; */
  /* width: 100%; */
  /* position: relative; */
}

/* Основной контент (центральная колонка) */
.main-content {
  padding: 2rem;
  /* background: rgba(255, 255, 255, 0.95); */
  border: 1px solid black;
  /* min-height: 100dhv; */
  flex-grow: 1; /* ← КЛЮЧЕВОЕ! Растягивает Main по ВЫСОТЕ */
}

/* .app-container бывший */
.layout { 
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
}

</style>
