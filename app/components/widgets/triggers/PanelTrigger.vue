<!-- components/widgets/triggers/PanelTrigger.vue -->
<template>
  <div class="panel-trigger" @click="$emit('click')">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path 
        d="M15 18L9 12L15 6" 
        stroke="currentColor" 
        stroke-width="2" 
        stroke-linecap="round" 
        stroke-linejoin="round"
      />
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.5" fill="none"/>
    </svg>
    <span class="trigger-label">{{ label }}</span>
  </div>
</template>

<script setup>
defineProps({
  label: { type: String, default: '' }  
})
defineEmits(['click'])
</script>

<style scoped>
.panel-trigger {
  width: 48px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 16px;
  gap: 6px;
  background: #f8fafc;
  border-left: 1px solid #e2e8f0;
  cursor: pointer;
  transition: background 0.15s;
  color: #64748b;
  flex-shrink: 0;
}

.panel-trigger:hover {
  background: #f1f5f9;
  color: #3b82f6;
}

.trigger-label {
  font-size: 11px;
  font-weight: 500;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  letter-spacing: 1px;
}
</style>