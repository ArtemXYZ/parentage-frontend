// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    '@nuxt/image',
    '@element-plus/nuxt' // <- Добавь это
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
    { path: '~/components/widgets/person-form', pathPrefix: false },
    { path: '~/components/construction/sections', pathPrefix: false }
  ],
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