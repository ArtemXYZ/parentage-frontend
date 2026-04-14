<script setup>
</script>


<template>

  <header class="site-header">
     
    <div class="header-left">
      <!-- Левая часть -->
      <span class="logo-text">Parentage</span>
    </div>

    <div class="header-center"><!-- Средняя часть --></div>

    <div class="header-right">
      <!-- Правая часть --> 
      <!-- <form class="d-flex">
            <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
            <button class="btn btn-outline-success" type="submit">Search</button>

      </form> -->
    </div>

  </header>

</template>


<style scoped>

.site-header {
  /* Включаем отступы внутрь элемента */
  box-sizing: border-box;

  /* Используем флексбокс для создания колонок */
  display: flex;

  /* align-items: stretch; Выравниваем содержимое по вертикали */
  flex-direction: row;

  /* Прижимаем её к верхней части окна */
  top: 0;

  /* Фиксируем высоту */
  /* height: 80px; */
  min-height: 6dvh;

  /* Растягиваем шапку на всю ширину  + */
  width: 100%;


  /* Коричневый фон градиент  */
  /* background-image: linear-gradient(
    rgba(26, 25, 26, 0.645),
    rgba(169, 87, 45, 0.885)
  ); */

  /* Лёгкая тень */
  /* box-shadow: 0 7px 5px rgba(0, 0, 0, 0.1);   */

   /* Внешние отступы */
  padding: 3px 0px;
  border: 1px solid black;
}

.header-right {
  /* Правая часть шапки */
  flex: 0 0 21%; /* width: 15% */
  display: flex;

  /* Текст по центру */
  text-align: center;
  border: 1px solid black;

  /* Включаем отступы внутрь элемента */
  box-sizing: border-box;


  align-items: center; /* Центрирование содержимого по вертикали */
  justify-content: center; /* Центрирование содержимого по горизонтали */

  /* background-image: linear-gradient(180deg, #fff, #ddd 40%, #ccc); */
  background-image: url('~/assets/images/logo.jpg');
  
  

  background-size: contain; /* Масштабировать, сохраняя пропорции */
  background-repeat: no-repeat;
  background-position: center;

  /* background-size: cover; /* Растянуть, чтобы покрыть блок */
  /* background-size: 100px 50px; /* Ширина и высота */
}

/* Средняя часть шапки */
.header-center {

  flex: 1;
  display: flex;
  text-align: center;

  font-size: 10px;
    /* Полужирный текст */
  font-weight: bold;

  border: 1px solid black;
}

/* Правая часть шапки */
.header-left {
  flex: 0 0 21%; /* width: 15% */

  /* Это нужно для выравнивания контента, если есть текст */
  display: flex;

  /* Центрирование содержимого по вертикали */
  align-items: center;

  /* Центрирование содержимого по горизонтали */
  justify-content: center;

  /* background-image: url("../../images/dns_portal_logo.png"); */

  /* Масштабировать, сохраняя пропорции */
  /* background-size: contain;  */
  background-repeat: no-repeat;
  background-position: center;
  border: 1px solid black;
}


.logo-text {
  font-size: 2rem;
  font-weight: bold;
  /* Хорошее сочетание цвета яркое сочное свежее  */
  background: linear-gradient(180deg, #a8f668, #01d9ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 10px 15px rgba(255, 252, 77, 0.975);
}


  /* --ui-header-height: calc(var(--spacing) * 16);  Вычисляемая высота шапки - взято из сайта документации накст. */ 

</style>