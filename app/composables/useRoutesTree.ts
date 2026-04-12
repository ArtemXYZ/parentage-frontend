// composables/useRoutesTree.ts
// import { useRouter } from '#app'

export interface RouteNode {
  name: string
  path: string
  label: string
  order?: number
  children?: RouteNode[]
  expanded?: boolean
}

export function useRoutesTree() {
  const router = useRouter()
  const routes = router.getRoutes().filter(route => 
    route.name && 
    !route.path.includes(':') && 
    route.path !== '/' &&
    !route.path.includes('404')
  )

  // Сортируем по order
  const sorted = routes.sort((a,b) => (a.meta?.order || 100) - (b.meta?.order || 100))

  // Группируем по первому сегменту пути (для простоты)
  const tree: RouteNode[] = []
  const map = new Map<string, RouteNode>()

  for (const route of sorted) {
    const parts = route.path.split('/').filter(p => p)
    let currentLevel = tree
    let currentPath = ''

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]
      currentPath += '/' + part
      let existing = currentLevel.find(node => node.path === currentPath)
      if (!existing) {
        const newNode: RouteNode = {
          name: route.name as string,
          path: currentPath,
          label: (i === parts.length-1) ? (route.meta?.title || route.name as string) : part,
          order: route.meta?.order,
          children: [],
          expanded: true
        }
        currentLevel.push(newNode)
        // сортировка на уровне
        currentLevel.sort((a,b) => (a.order || 100) - (b.order || 100))
        existing = newNode
      }
      if (i === parts.length-1) {
        // лист, больше ничего не делаем
      } else {
        currentLevel = existing.children!
      }
    }
  }

  return tree
}