/* Abi Bhaskara copyright 2025 */
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const posts = sqliteTable('posts', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    slug: text('slug').notNull().unique(),
    title: text('title').notNull(),
    content: text('content').notNull(), // Markdown content
    description: text('description'),
    image: text('image'),
    tags: text('tags'), // JSON string or comma-separated
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(new Date()),
});
