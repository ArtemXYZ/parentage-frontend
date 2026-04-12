// stores/drawer.ts
import { defineStore } from 'pinia'

export const useDrawerStore = defineStore('drawer', {
  state: () => ({
    isOpen: false,
    title: '',
    personId: null,
  }),
  actions: {
    open(personId: string, title: string = 'Редактирование') {
      this.isOpen = true
      this.personId = personId
      this.title = title
    },
    close() {
      this.isOpen = false
      this.personId = null
    }
  }
})