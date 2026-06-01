<!-- components/construction/sections/tree-layout/RightDrawer.vue -->
<template>
  <div ref="dockRef" class="right-dock">
    <div class="icon-bar">
      <!-- Функциональная кнопка (редактор) -->
      <div class="icon-section top">
        <div
          class="icon-item"
          :class="{ active: isEditorOpen }"
          @click="openEditorPanel"
        >
          <Icon name="ph:sidebar-right" class="dock-icon" />
          <span class="tooltip">Редактор</span>
        </div>
      </div>

      <!-- Разделитель -->
      <div class="icon-bar-divider"></div>

      <!-- Системные иконки -->
      <div class="icon-section bottom">
        <div class="icon-item">
          <Icon name="ph:bell" class="dock-icon" />
          <span class="tooltip">Уведомления</span>
        </div>
        <div class="icon-item">
          <Icon name="ph:chat-circle" class="dock-icon" />
          <span class="tooltip">Сообщения</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const isEditorOpen = inject('isEditorOpen')
const openEditorPanel = inject('openEditorPanel')
</script>

<style scoped>
.right-dock {
  position: relative;
  z-index: 20;
}

.icon-bar {
  width: 40px;
  background: #1e2a36;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  padding-top: 1rem;
}

.icon-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.icon-item {
  position: relative;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  transition: background 0.2s;
  color: #bdc3c7;
}

.icon-item:hover {
  background: #2c3e50;
  color: #ffffff;
}

.icon-item.active {
  background: #1abc9c;
  color: #ffffff;
}

.dock-icon {
  width: 22px;
  height: 22px;
}

.tooltip {
  position: absolute;
  right: 60px;
  background: #34495e;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s;
}

.icon-item:hover .tooltip {
  opacity: 1;
}

.icon-bar-divider {  
  width: 30px;
  height: 1px;
  background: #3b4a5a;
  margin: 12px 0;
}
</style>