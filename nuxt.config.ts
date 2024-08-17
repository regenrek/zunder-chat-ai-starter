// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  modules: ['@nuxt/ui', '@zunderai/ui'],

  future: {
    compatibilityVersion: 4,
  },

  runtimeConfig: {
    openaiApiKey: process.env.OPENAI_API_KEY,
    public: {
      useSimulatedChat: process.env.USE_SIMULATED_CHAT === "true",
    },
  },

  experimental: {
    componentIslands: true,
  },
})