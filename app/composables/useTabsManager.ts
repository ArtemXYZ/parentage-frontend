// composables/useTabsManager.js
export const useTabsManager = () => {
  const openTabs = ref([])
  const activeTab = ref(null)

  const addTab = (tab) => {
    const existing = openTabs.value.find(t => t.id === tab.id)
    if (existing) {
      activeTab.value = tab.id
      return
    }
    openTabs.value.push({ ...tab })
    activeTab.value = tab.id
  }

  const closeTab = (id) => {
    const index = openTabs.value.findIndex(t => t.id === id)
    if (index === -1) return
    openTabs.value.splice(index, 1)
    if (activeTab.value === id) {
      activeTab.value = openTabs.value[0]?.id || null
    }
  }

  const closeAllTabs = () => {
    openTabs.value = []
    activeTab.value = null
  }

  const setActiveTab = (id) => {
    activeTab.value = id
  }

  return {
    openTabs: readonly(openTabs),
    activeTab: readonly(activeTab),
    addTab,
    closeTab,
    closeAllTabs,
    setActiveTab
  }
}