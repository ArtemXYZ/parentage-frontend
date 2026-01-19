// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    '@nuxt/image',
  ],
    css: [
    '~/assets/css/global.css'
  ]
  
  // routeRules: {
  //   // Set layout for specific route
  //   '/index': { DefaultLayout: 'default' },
  //   // Set layout for multiple routes
  //   // '/dashboard/**': { appLayout: 'dashboard' },
  // },

  //   components: [
  //   // Автоимпорт из твоей структуры папок
  //   { path: '~/components/sections/headers', prefix: '', extensions: ['vue'] },
  //   { path: '~/components/sections/main_containers', prefix: '', extensions: ['vue'] },
  //   { path: '~/components/sections/footers', prefix: '', extensions: ['vue'] },
  //   // Стандартный путь для остальных компонентов
  //   '~/components'
  // ]

})
