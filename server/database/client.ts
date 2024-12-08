import { drizzle } from 'drizzle-orm/node-postgres'
import pg from 'pg'

const pool = new pg.Pool({
  connectionString: process.env.NUXT_DATABASE_CONNECTION_STRING,
})

// Only for migrations
export const connection = new pg.Client({
  connectionString: process.env.NUXT_DATABASE_CONNECTION_STRING,
})

export const db = drizzle(pool)
