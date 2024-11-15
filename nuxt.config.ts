// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@prisma/nuxt'],
  app: {
    head: {
      title: 'TaikoLens',
      meta: [
        { name: 'description', content: 'Real-time analytics dashboard for USDT on Taiko network' }
      ],
    }
  },
  runtimeConfig: {
    public: {
      contractAddress: process.env.CONTRACT_ADDRESS,
      taikoscanApiKey: process.env.TAIKOSCAN_API_KEY
    }
  },
  vite: {
    resolve: {
      alias: {
        '.prisma/client/index-browser': './node_modules/.prisma/client/index-browser.js',
      },
    },
  },
})