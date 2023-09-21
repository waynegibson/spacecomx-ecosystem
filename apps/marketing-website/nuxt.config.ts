import { env } from 'node:process'

export default defineNuxtConfig({
  devtools: { enabled: true },

  srcDir: 'src/',

  modules: [
    '@pinia/nuxt',
    '@vueuse/nuxt',
  ],

  runtimeConfig: {
    public: {
      api: {
        baseUrl: env.NUXT_API_BASE_URL,
        serviceUrl: env.NUXT_API_SERVICE_URL,
      },
      media: {
        basePath: env.NUXT_MEDIA_BASE_PATH,
      },
    },
  },

  typescript: {
    shim: false,
    typeCheck: false,
    tsConfig: {
      compilerOptions: {
        strict: true,
        jsx: 'preserve',
        types: [
          '@pinia/nuxt',
          '@vueuse/core',
          '@vueuse/nuxt',
        ],
      },
    },
  },
})
