import express from 'express';
import cors from 'cors';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { eq, desc } from 'drizzle-orm';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Database Schema (Same as worker.js)
const posts = sqliteTable('posts', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    title: text('title').notNull(),
    slug: text('slug').notNull().unique(),
    description: text('description'),
    content: text('content').notNull(),
    image: text('image'),
    tags: text('tags'),
    mediaType: text('media_type'),
    youtubeUrl: text('youtube_url'),
    carouselImages: text('carousel_images'),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

const settings = sqliteTable('settings', {
    key: text('key').primaryKey(),
    value: text('value').notNull(),
});

const analytics = sqliteTable('analytics', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    path: text('path').notNull(),
    timestamp: integer('timestamp', { mode: 'timestamp' }).notNull(),
    date: text('date').notNull(),
});

const achievements = sqliteTable('achievements', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    title: text('title').notNull(),
    description: text('description').notNull(),
    year: text('year').notNull(),
    category: text('category').notNull(),
    icon: text('icon'),
    image: text('image'),
    link: text('link'),
    order: integer('order').default(0),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

const client = createClient({
    url: process.env.TURSO_DATABASE_URL || "file:local.db",
    authToken: process.env.TURSO_AUTH_TOKEN || "",
});

const db = drizzle(client);

// Initialize Tables
async function initDb() {
    await client.execute(`
        CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            slug TEXT NOT NULL UNIQUE,
            description TEXT,
            content TEXT NOT NULL,
            image TEXT,
            tags TEXT,
            media_type TEXT,
            youtube_url TEXT,
            carousel_images TEXT,
            created_at INTEGER NOT NULL
        )
    `);
    await client.execute(`
        CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL
        )
    `);
    await client.execute(`
        CREATE TABLE IF NOT EXISTS analytics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            path TEXT NOT NULL,
            timestamp INTEGER NOT NULL,
            date TEXT NOT NULL
        )
    `);
    await client.execute(`
        CREATE TABLE IF NOT EXISTS achievements (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            year TEXT NOT NULL,
            category TEXT NOT NULL,
            icon TEXT,
            image TEXT,
            link TEXT,
            "order" INTEGER DEFAULT 0,
            created_at INTEGER NOT NULL
        )
    `);
    console.log("Database initialized.");
}

initDb();

// --- API Routes ---

// Achievements
app.get('/api/achievements', async (req, res) => {
    try {
        const result = await db.select().from(achievements).orderBy(achievements.order);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/achievements', async (req, res) => {
    try {
        const { title, description, year, category, icon, image, link, order } = req.body;
        const result = await db.insert(achievements).values({
            title, description, year, category, icon, image, link, order,
            createdAt: new Date()
        }).returning();
        res.status(201).json(result[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/achievements/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { id: _, createdAt: __, ...updateData } = req.body;
        const result = await db.update(achievements).set(updateData).where(eq(achievements.id, id)).returning();
        res.json(result[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/achievements/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await db.delete(achievements).where(eq(achievements.id, id));
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Settings (Dummy for Admin UI)
app.get('/api/settings', async (req, res) => {
    res.json({
        "blog_header_media_type": "youtube",
        "blog_header_youtube_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        "blog_header_carousel_images": "[]"
    });
});

// Analytics (Dummy for Admin UI)
app.get('/api/analytics/summary', async (req, res) => {
    res.json({
        totalViews: 0,
        todayViews: 0,
        totalPosts: 0,
        topPosts: []
    });
});

// Posts (Dummy)
app.get('/api/posts', async (req, res) => {
    res.json([]);
});

// Upload (Mock)
app.post('/api/upload', (req, res) => {
    res.json({ url: '/achievements/default.png' });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
