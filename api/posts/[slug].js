/* Abi Bhaskara copyright 2025 */
import { db, posts } from '../_lib/db.js';
import { eq } from 'drizzle-orm';
import { setCorsHeaders, handlePreflight } from '../_lib/cors.js';

export default async function handler(req, res) {
    setCorsHeaders(res, ['GET', 'PUT', 'DELETE', 'OPTIONS']);
    if (handlePreflight(req, res)) return;

    const { slug } = req.query;

    if (!slug) {
        return res.status(400).json({ error: 'Slug parameter is required' });
    }

    try {
        if (req.method === 'GET') {
            const post = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1);
            if (!post.length) {
                return res.status(404).json({ error: 'Post not found' });
            }
            return res.status(200).json(post[0]);
        }

        if (req.method === 'PUT') {
            // Validate body exists
            if (!req.body || Object.keys(req.body).length === 0) {
                return res.status(400).json({ error: 'Request body is required' });
            }

            const { id: bodyId, createdAt, ...updateData } = req.body;

            // Validate we have data to update
            if (Object.keys(updateData).length === 0) {
                return res.status(400).json({ error: 'No update data provided' });
            }

            const updatedPost = await db.update(posts)
                .set(updateData)
                .where(eq(posts.slug, slug))
                .returning();

            if (!updatedPost.length) {
                return res.status(404).json({ error: 'Post not found' });
            }
            return res.status(200).json(updatedPost[0]);
        }

        if (req.method === 'DELETE') {
            await db.delete(posts).where(eq(posts.slug, slug));
            return res.status(204).end();
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

