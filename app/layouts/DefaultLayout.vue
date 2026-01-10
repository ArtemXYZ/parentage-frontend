<script setup>
</script>

<template>
  <div>
    <Header />
  </div>

  <div>
    <Main />   
    <slot />     <!-- В этот слот попадёт ВЕСЬ контент страницы -->
  </div>

  <div>
    <Footer />
  </div>

</template>


<style>
</style>
