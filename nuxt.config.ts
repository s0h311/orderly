export default defineNuxtConfig({
  modules: ['@sidebase/nuxt-auth'],
  future: {
    compatibilityVersion: 4,
  },
  devtools: { enabled: true },
  auth: {
    provider: {
      type: 'authjs',
    },
  },
  // Do not set the keys here. Use .env instead
  runtimeConfig: {
    databaseConnectionString: '',
    auth: {
      secret: '',
      github: {
        clientId: '',
        clientSecret: '',
      },
      google: {
        clientId: '',
        clientSecret: '',
      },
      twitter: {
        clientId: '',
        clientSecret: '',
      },
      email: {
        host: '',
        port: '',
        username: '',
        password: '',
        senderName: '',
      },
    },
    payment: {
      stripe: {
        publishableKey: '',
        secretKey: '',
        whsec: '',
      },
    },
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  css: ['~~/app/app.css'],
})
