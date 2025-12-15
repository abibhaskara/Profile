/* Abi Bhaskara copyright 2025 */
/* 
 * Script untuk migrasi data dari SQLite lokal ke Turso
 * 
 * Cara pakai:
 * 1. Set environment variables:
 *    export TURSO_DATABASE_URL=libsql://your-db.turso.io
 *    export TURSO_AUTH_TOKEN=your-token
 * 
 * 2. Jalankan: node scripts/migrate-to-turso.js
 */

import { createClient } from '@libsql/client';
import Database from 'better-sqlite3';

async function migrate() {
    console.log('🚀 Starting migration to Turso...\n');

    // Check environment variables
    if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
        console.error('❌ Error: Please set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN environment variables');
        console.log('\nExample:');
        console.log('export TURSO_DATABASE_URL=libsql://your-database.turso.io');
        console.log('export TURSO_AUTH_TOKEN=your-auth-token');
        process.exit(1);
    }

    // Connect to local SQLite
    console.log('📂 Connecting to local SQLite database...');
    const localDb = new Database('blog.db');

    // Connect to Turso
    console.log('☁️  Connecting to Turso...');
    const tursoClient = createClient({
        url: process.env.TURSO_DATABASE_URL,
        authToken: process.env.TURSO_AUTH_TOKEN,
    });

    try {
        // Create table in Turso
        console.log('📋 Creating posts table in Turso...');
        await tursoClient.execute(`
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

        // Get all posts from local database
        console.log('📖 Reading posts from local database...');
        const localPosts = localDb.prepare('SELECT * FROM posts').all();
        console.log(`   Found ${localPosts.length} posts\n`);

        if (localPosts.length === 0) {
            console.log('ℹ️  No posts to migrate. Done!');
            return;
        }

        // Insert posts into Turso
        console.log('⬆️  Migrating posts to Turso...');
        for (const post of localPosts) {
            await tursoClient.execute({
                sql: `INSERT OR REPLACE INTO posts (id, slug, title, content, description, image, tags, created_at) 
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                args: [post.id, post.slug, post.title, post.content, post.description, post.image, post.tags, post.created_at]
            });
            console.log(`   ✓ Migrated: ${post.title}`);
        }

        console.log('\n✅ Migration completed successfully!');
        console.log(`   Total posts migrated: ${localPosts.length}`);

    } catch (error) {
        console.error('\n❌ Migration failed:', error.message);
        process.exit(1);
    } finally {
        localDb.close();
    }
}

migrate();
