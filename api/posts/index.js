/* Abi Bhaskara copyright 2025 */
import { db, posts } from '../_lib/db.js';
import { desc } from 'drizzle-orm';

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        if (req.method === 'GET') {
            // GET all posts
            const allPosts = await db.select().from(posts).orderBy(desc(posts.createdAt));
            return res.status(200).json(allPosts);
        }

        if (req.method === 'POST') {
            // POST create new post
            const newPost = await db.insert(posts).values({
                ...req.body,
                createdAt: Math.floor(Date.now() / 1000),
            }).returning();
            return res.status(201).json(newPost[0]);
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ error: error.message });
    }
}
