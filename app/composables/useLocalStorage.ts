// composables/useLocalStorage.ts
import { ref, watch } from 'vue'

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const data = ref<T>(defaultValue)

  // Проверяем, что мы на клиенте (браузер)
  if (import.meta.client) {
    const stored = localStorage.getItem(key)
    if (stored !== null) {
      try {
        data.value = JSON.parse(stored)
      } catch (e) {
        console.warn(`Failed to parse localStorage key "${key}":`, e)
      }
    }

    // Сохраняем изменения в localStorage только на клиенте
    watch(data, () => {
      localStorage.setItem(key, JSON.stringify(data.value))
    }, { deep: true })
  }

  return data
}