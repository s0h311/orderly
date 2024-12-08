import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'postgresql',
  schema: ['./server/database/schemas/auth.ts', './server/database/schemas/public.ts'],
  out: './server/database/migrations',
  dbCredentials: {
    url: process.env.NUXT_DATABASE_CONNECTION_STRING!,
  },
})
