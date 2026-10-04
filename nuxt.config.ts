// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  routeRules: {
    '/': {
      headers: {
        'Cache-Control': 'no-transform',
      },
    },
    '/fonts/**': {
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    },
    '/images/**': {
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    },
  },
  runtimeConfig: {
    public: {
      apiBase:
        process.env.NUXT_PUBLIC_API_BASE ||
        (process.env.NODE_ENV === 'production'
          ? 'https://api.mdfurniandcraft.my.id/api/v2'
          : 'https://api-mahendra.test/api/v2'),
      siteUrl:
        process.env.NUXT_PUBLIC_SITE_URL ||
        process.env.NUXT_SITE_URL ||
        'https://mdfurniandcraft.my.id',
    },
  },
})
