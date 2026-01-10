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
</style>