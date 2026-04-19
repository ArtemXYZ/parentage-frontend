<!-- layouts/tree-layout.vue -->
<template>
  <div class="tree-layout">
    <HeaderMini />
    <NavBar />
    <main ref="mainRef" class="tree-main">
      <LeftDock />
      <div class="canvas-container">
        <slot />
      </div>
      <PanelTrigger @click="openEditorPanel" />
    </main>
    <FooterMini />
    <FloatingPanel
      v-model:is-open="isEditorOpen"
      title="Редактор"
      :container-ref="mainRef"
      :default-width="380"
      storage-key="right-editor-width"
    >
      <slot name="editor-content">
        <div class="default-content">
          <p>Выберите персону для редактирования</p>
        </div>
      </slot>
    </FloatingPanel>
  </div>
</template>

<script setup>
import PanelTrigger from '~/components/widgets/triggers/PanelTrigger.vue'
import FloatingPanel from '~/components/widgets/overlays/FloatingPanel.vue'
import { useTabsManager } from '~/composables/useTabsManager'

const mainRef = ref(null)
const isEditorOpen = ref(false)

const tabsManager = useTabsManager()
provide('tabsManager', tabsManager)
provide('openEditor', () => { isEditorOpen.value = true })

const openEditorPanel = () => { isEditorOpen.value = true }
</script>

<style scoped>
.tree-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
}
.tree-main {
  display: flex;
  flex: 1;
  position: relative;
  overflow: hidden;
}
.canvas-container {
  flex: 1;
  position: relative;
  background: transparent;
  overflow: hidden;
}
.default-content {
  color: #64748b;
  font-size: 13px;
  text-align: center;
  padding: 20px;
}
</style>