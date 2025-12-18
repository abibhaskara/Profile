
import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';

export default defineConfig({
    schema: './server/db/schema.js',
    out: './drizzle',
    dialect: 'sqlite',
    driver: 'turso',
    dbCredentials: {
        url: process.env.TURSO_DATABASE_URL,
        authToken: process.env.TURSO_AUTH_TOKEN,
    },
});
