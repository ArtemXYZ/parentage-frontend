// nuxt.config.
export default defineNuxtConfig({
  compatibilityDate: '2026-02-17',  // убирает warning

  devtools: { enabled: true },

  modules: [
    '@nuxt/ui',
    '@nuxt/image',
    '@nuxt/icon',
    // Добавь, если используешь: 'nuxt-og-image', '@vueuse/nuxt', '@nuxt/scripts' и т.д.
  ],

  css: ['~/assets/css/main.css'],  // если у тебя есть глобальные стили, иначе удали

  colorMode: {
    preference: 'dark'  // как у nuxt.com
  },

  content: {
    // Базовая настройка подсветки кода (можно расширить)
    build: {
      markdown: {
        highlight: {
          theme: {
            default: 'material-theme-lighter',
            dark: 'material-theme-palenight'
          },
          langs: ['js', 'ts', 'vue', 'css', 'html', 'bash', 'md', 'json']
        }
      }
    }
  },

  ui: {
    // Если хочешь их цвета/темы
    theme: {
      colors: ['primary', 'secondary', 'info', 'success', 'warning', 'error']
    }
  },

  // Минимальные routeRules для docs-сайта (добавь свои страницы)
  routeRules: {
    // Главные страницы — prerender для скорости
    '/': { prerender: true },
    '/index.html': { prerender: true },

    // Docs-раздел — если у тебя много MD-файлов
    '/docs/**': { prerender: true },          // или isr: 3600, если контент меняется
    '/blog/**': { prerender: true },

    // API или динамические — ISR
    '/api/**': { isr: 3600 },  // 1 час


    // 404
    '/404.html': { prerender: true }
  },

  nitro: {
    prerender: {
      routes: ['/']  // можно добавить больше для начального prerender
    }
  }
})