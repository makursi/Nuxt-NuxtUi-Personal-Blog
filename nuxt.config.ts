// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  modules: ['@nuxt/content', '@nuxt/ui', '@pinia/nuxt'],
  ui:{
    theme:{
       colors:['primary','error']
    }
  },
  css: ['/assets/css/main.css']
})