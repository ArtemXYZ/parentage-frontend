<!-- components/widgets/controls/ZoomControls.vue -->
<template>
  <div class="zoom-controls">
    <button @click="zoomIn" class="zoom-btn" title="Приблизить">+</button>
    <button @click="zoomOut" class="zoom-btn" title="Отдалить">−</button>
    <button @click="resetZoom" class="zoom-btn" title="Сбросить">⌂</button>
  </div>
</template>

<script setup>
const emit = defineEmits(['zoomIn', 'zoomOut', 'reset'])

const zoomIn = () => emit('zoomIn')
const zoomOut = () => emit('zoomOut')
const resetZoom = () => emit('reset')
</script>

<style scoped>
.zoom-controls {
  position: absolute;
  bottom: 20px;
  left: 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(4px);
  padding: 6px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #dee2e6;
}
.zoom-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: none;
  border-radius: 6px;
  font-size: 18px;
  font-weight: 500;
  color: #495057;
  cursor: pointer;
  transition: all 0.2s;
}
.zoom-btn:hover {
  background: #f8f9fa;
  color: #212529;
}
</style>