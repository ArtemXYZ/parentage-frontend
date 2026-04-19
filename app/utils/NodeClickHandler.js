// utils/NodeClickHandler.js
export class NodeClickHandler {
  constructor(tabsManager, openEditor) {
    this.tabsManager = tabsManager
    this.openEditor = openEditor
  }

  handlePersonClick(personData) {
    if (personData.type !== 'person') return
    const personId = personData.name.replace(/\s+/g, '-').toLowerCase()
    this.tabsManager.addTab({
      id: `person-${personId}`,
      title: personData.name,
      type: 'person',
      data: personData
    })
    this.openEditor()
  }
}