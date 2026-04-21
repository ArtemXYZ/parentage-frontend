// utils/NodeClickHandler.js
export class NodeClickHandler {
  constructor(tabsManager, openEditor) {
    this.tabsManager = tabsManager
    this.openEditor = openEditor
  }

  handleSingleClick(personData) {
    if (personData.type !== 'person') return
    const tabId = `person-${personData.id}`
    const existingTab = this.tabsManager.openTabs.value.find(t => t.id === tabId)
    if (existingTab) {
      this.tabsManager.setActiveTab(tabId)
    } else {
      this.tabsManager.replaceActiveTab({
        id: tabId,
        title: personData.name,
        type: 'person',
        data: personData
      })
    }
    this.openEditor?.()
  }

  handleDoubleClick(personData) {
    if (personData.type !== 'person') return
    const uniqueId = `person-${personData.id}-${Date.now()}`
    this.tabsManager.addTab({
      id: uniqueId,
      title: personData.name,
      type: 'person',
      data: personData
    })
    this.openEditor?.()
  }

  handlePersonClick(personData) {
    this.handleSingleClick(personData)
  }
}