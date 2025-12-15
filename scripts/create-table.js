/* Script to create the posts table in Turso */
import { createClient } from '@libsql/client';
import 'dotenv/config';

const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
});

async function createTable() {
    try {
        await client.execute(`
            CREATE TABLE IF NOT EXISTS posts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                slug TEXT NOT NULL UNIQUE,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                description TEXT,
                image TEXT,
                tags TEXT,
                created_at INTEGER NOT NULL
            )
        `);
        console.log('✅ Table "posts" created successfully!');
    } catch (error) {
        console.error('❌ Error creating table:', error);
    }
}

createTable();
