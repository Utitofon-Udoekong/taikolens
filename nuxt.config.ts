// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@prisma/nuxt'],
  app: {
    head: {
      title: 'USDT Taiko Analytics',
      meta: [
        { name: 'description', content: 'Real-time analytics dashboard for USDT on Taiko network' }
      ],
    }
  },
  runtimeConfig: {
    public: {
      contractAddress: process.env.CONTRACT_ADDRESS
    }
  }
})