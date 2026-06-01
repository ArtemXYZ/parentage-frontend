<!-- components/construction/NavBar.vue -->
<template>
  <div class="navbar-wrapper">
    <nav class="header-navigation">
      <!-- <div class="left-group">
        <span class="app-logo">Parentage</span>
      </div> -->

      <!-- <div class="center-group">
        <Breadcrumbs />
      </div> -->

      <!-- <div class="right-group">
        <AppSearch />
        <div class="divider"></div>
        <ThemeSwitcher />
        <div class="divider"></div>
        <UserMenu />
      </div> -->
    </nav>
  </div>
</template>

<script setup>
</script>

<style scoped>
.navbar-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.header-navigation {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 40px;
  padding: 0 16px;
  border-bottom: 1px solid #2c3e50;
  background: #1e2a36;
}
.left-group {
  display: flex;
  align-items: center;
  flex: 1;
}
.app-logo {
  font-size: 16px;
  font-weight: 600;
  color: #ecf0f1;
  letter-spacing: -0.5px;
}
.center-group {
  flex: 2;
  display: flex;
  justify-content: center;
}
.right-group {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  justify-content: flex-end;
}
.divider {
  width: 1px;
  height: 20px;
  background: #3b4a5a;
}
</style>