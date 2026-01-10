<script setup>
</script>


<template setup>

    <aside class="site-sidebar">

        <div class="sidebar-section">
          <h3>Боковая панель</h3>
          <p>Дополнительная информация, виджеты и т.д.</p>
        </div>

    </aside>      

</template>


<style scoped>

/* Сайдбар */
.site-sidebar {
  flex: 0.3; 
  display: flex;
  flex-direction: row;

  border: 1px solid black;
  text-align: center;
  min-height: 100hv;

}

.sidebar-section {
  margin-bottom: 1.5rem;
}

.sidebar-section h3 {
  color: #333;
  margin-bottom: 1rem;
}

    
</style>