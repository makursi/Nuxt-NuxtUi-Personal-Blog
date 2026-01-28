// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  modules: [
    '@nuxt/content',
    '@nuxt/ui',
    '@pinia/nuxt',
    '@nuxt/icon',
  ],
  ui:{
    theme:{
       colors:['primary','error']
    }
  },
  css: ['/assets/css/main.css'],
  runtimeConfig:{
    public:{
      BASE_URL: process.env.BASE_URL,
      API_BASE_URL: process.env.API_BASE_URL,
    }
  },
  tiptap:{
     prefix:'Tiptap'
  }
})