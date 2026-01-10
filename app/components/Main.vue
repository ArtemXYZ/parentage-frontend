<script setup>
</script>


<template>

    <main class="site-main">

        <Nav />
        <Content />
        <Sidebar />

    </main>

</template>


<style scoped>
.site-main {

  /* top: 0; */
  /* bottom: 0; */
  z-index: 1000;
  flex-direction: row;
  display: flex;
  background: rgb(180, 226, 43);
  /* border: 1px solid blueviolet; */
  /* margin: 0; */
  box-sizing: border-box;
  min-height: 80vh;
  width: 100%;

  flex-grow: 1; /* Ключевое свойство - занимает всё доступное пространство */


}
</style>