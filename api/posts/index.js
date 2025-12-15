/* Abi Bhaskara copyright 2025 */
import { db, posts } from '../_lib/db.js';
import { desc } from 'drizzle-orm';
import { setCorsHeaders, handlePreflight } from '../_lib/cors.js';

export default async function handler(req, res) {
    setCorsHeaders(res, ['GET', 'POST', 'OPTIONS']);
    if (handlePreflight(req, res)) return;

    try {
        if (req.method === 'GET') {
            const allPosts = await db.select().from(posts).orderBy(desc(posts.createdAt));
            return res.status(200).json(allPosts);
        }

        if (req.method === 'POST') {
            const { slug, title, content, description, image, tags } = req.body;

            // Input validation
            if (!slug || !title || !content) {
                return res.status(400).json({
                    error: 'Missing required fields: slug, title, and content are required'
                });
            }

            const newPost = await db.insert(posts).values({
                slug: slug.trim(),
                title: title.trim(),
                content,
                description: description || '',
                image: image || '',
                tags: tags || '[]',
                createdAt: Math.floor(Date.now() / 1000),
            }).returning();

            return res.status(201).json(newPost[0]);
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

