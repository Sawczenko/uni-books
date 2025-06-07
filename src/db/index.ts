import 'dotenv/config'
import * as schema from './schema';

import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

const connectionString = process.env.POSTGRES_URL

if (connectionString === undefined) {
    throw new Error('DB connection string is missing')
}

export const client = postgres(connectionString, { prepare: false })
export const db = drizzle<typeof schema>(
    client,
    {
        schema
    }
);