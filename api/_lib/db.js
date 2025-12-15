/* Abi Bhaskara copyright 2025 */
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// Schema definition
export const posts = sqliteTable('posts', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    slug: text('slug').notNull().unique(),
    title: text('title').notNull(),
    content: text('content').notNull(),
    description: text('description'),
    image: text('image'),
    tags: text('tags'),
    createdAt: integer('created_at').notNull(),
});

// Create Turso client
const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
});

// Export drizzle instance
export const db = drizzle(client, { schema: { posts } });
