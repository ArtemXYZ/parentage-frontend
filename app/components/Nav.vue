<script setup>
</script>

<template>
  <nav class="navigation">
    <!-- Правильно для Nuxt 4 -->
    <!-- <div class="nav-header">
      <NuxtLink to="/" class="nav-logo">Parentage</NuxtLink>
    </div> -->
    
    <ul class="nav-menu">
      <!-- Внутренние ссылки (в пределах приложения) -->
      <li><NuxtLink to="/" class="nav-link">Главная</NuxtLink></li>
      <!-- <li><NuxtLink to="/about" class="nav-link">О проекте</NuxtLink></li> -->
      
      <!-- Якорные ссылки (в пределах страницы) -->
      <!-- <li><a href="#features" class="nav-link">Возможности</a></li>
      <li><a href="#contacts" class="nav-link">Контакты</a></li> -->
    </ul>
  </nav>
</template>

<style scoped>
  
.navigation {
  flex: 0.3;
  display: flex;
  
  box-sizing: border-box;
  border: 1px solid black;
  
  /* padding: 2rem; */
  height: 100hv;
  
  flex-direction: column;
}

/* .nav-header {
  margin-bottom: 2rem;
} */

.nav-logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  text-decoration: none;
  font-family: 'Arial Rounded MT Bold', sans-serif;
  display: block;
  /* padding: 0.5rem 0; */
}

.nav-menu {
  list-style: none;
  padding: 0;
  margin: 0;
  /* flex-grow: 1; */
}

.nav-menu li {
  margin-bottom: 0.8rem;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  display: block;
  transition: all 0.3s ease;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateX(5px);
}

/* Стиль для активной страницы */
.router-link-active {
  background: rgba(255, 255, 255, 0.2);
  font-weight: bold;
}
</style>