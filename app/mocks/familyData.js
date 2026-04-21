// mocks/familyData.js
export const familyTreeData = [
  {
    id: 'ivan',
    name: 'Иван Петров',
    type: 'person',
    gender: 'male',
    birthYear: 1950,
    expanded: true,
    children: [
      {
        id: 'alexey',
        name: 'Алексей Иванов',
        type: 'person',
        gender: 'male',
        birthYear: 1975,
        expanded: false,
        children: [
          { id: 'dmitry', name: 'Дмитрий Алексеев', type: 'person', gender: 'male', birthYear: 2000 },
          { id: 'anna', name: 'Анна Алексеева', type: 'person', gender: 'female', birthYear: 2002 }
        ]
      },
      {
        id: 'sergey',
        name: 'Сергей Петров',
        type: 'person',
        gender: 'male',
        birthYear: 1970,
        children: [
          { id: 'olga', name: 'Ольга Сергеева', type: 'person', gender: 'female', birthYear: 1995 }
        ]
      }
    ]
  },
  {
    id: 'maria',
    name: 'Мария Иванова',
    type: 'person',
    gender: 'female',
    birthYear: 1955,
    expanded: true,
    children: [
      { id: 'elena', name: 'Елена Иванова', type: 'person', gender: 'female', birthYear: 1978 }
    ]
  }
]

// Для D3-графа (нужен корень с name и children)
export const hierarchyData = {
  name: 'Род Петровых',
  children: familyTreeData
}