<!-- layouts/tree-layout.vue -->
<template>

  <div class="tree-layout">
    
    <!-- 1 -->
    <HeaderMini />

    <!-- 2 -->
    <NavBar />

    <!-- 3 центральный контейнер под контент: дерево. Боковые панели по верх парящие.-->
    <main ref="mainRef" class="tree-main">
      
      <!-- 3.1. -->
      <LeftDock />

      
      <!-- 3.2. Контейнер под канву для деревьев -->
      <div class="canvas-container">
        
        <!-- 3.2.1. Сюда падает -->
        <slot />
      </div>
      

      
      <!-- 3.3. Правая панель парящая (редактор)-->
      <PanelTrigger @click="openEditorPanel" />

    </main>

    <!-- 4 Подвал миниатюрный -->
    <FooterMini />


    <!-- Как убрать это? Переделать \ инкапсулировать \ выынести - неструктурное расположение -->
    <FloatingPanelBlack
      v-model:is-open="isEditorOpen"
      title="Редактор"
      :container-ref="mainRef"
      :default-width="320"
      storage-key="right-editor-width"
    >

    
      <!-- РАзобраться что это?  -->
      <slot name="editor-content">
        <div class="default-content">
          <p>Выберите персону для редактирования</p>
        </div>
      </slot>
    </FloatingPanelBlack>

  </div>

</template>

<script setup>

const currentGraphType = ref('dendrogram')
provide('graphType', readonly(currentGraphType))
provide('setGraphType', (type) => { currentGraphType.value = type })

const mainRef = ref(null)
const isEditorOpen = ref(false)

const tabsManager = useTabsManager()
provide('tabsManager', tabsManager)
provide('openEditor', () => { isEditorOpen.value = true })

// Для подсветки выбранного узла в дереве
const selectedNodeId = ref(null)
const setSelectedNode = (id) => { selectedNodeId.value = id }
provide('selectedNodeId', selectedNodeId)
provide('setSelectedNode', setSelectedNode)

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