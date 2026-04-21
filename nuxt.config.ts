// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    '@nuxt/image',
    '@pinia/nuxt',
    '@element-plus/nuxt',

  ],
  css: [
    '~/assets/css/global.css'
  ],
  
  app: {
    head: {
      title: 'Parentage', // default fallback title
      htmlAttrs: {
        lang: 'ru',
      },

    },
  },
  
  components: [
    { path: '~/components/construction/sections', pathPrefix: false },
    { path: '~/components/construction/sections/default', pathPrefix: false },
    { path: '~/components/construction/sections/tree-layout', pathPrefix: false },
    // 
    { path: '~/pages', pathPrefix: false },
    // 
    { path: '~/components/widgets/person-form', pathPrefix: false },
    { path: '~/components/widgets/menu', pathPrefix: false },
    { path: '~/components/widgets/trees', pathPrefix: false },
    { path: '~/components/widgets/backgrounds/trees', pathPrefix: false },
    { path: '~/components/widgets/backgrounds/live', pathPrefix: false },
    { path: '~/components/widgets/triggers', pathPrefix: false },
    { path: '~/components/widgets/selectors', pathPrefix: false },
    { path: '~/components/widgets/overlays', pathPrefix: false }
  ]
})


      // link: [
      //   { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      // ],

  // routeRules: {
  //   // Set layout for specific route
  //   '/index': { DefaultLayout: 'default' },
  //   // Set layout for multiple routes
  //   // '/dashboard/**': { appLayout: 'dashboard' },
  // },