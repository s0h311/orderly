import 'dotenv/config'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { db, connection } from '~~/server/database/client'

await migrate(db, { migrationsFolder: 'server/database/migrations' })

await connection.end()
