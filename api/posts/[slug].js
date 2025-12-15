/* Abi Bhaskara copyright 2025 */
import { db, posts } from '../_lib/db.js';
import { eq } from 'drizzle-orm';

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { slug } = req.query;

    try {
        if (req.method === 'GET') {
            // GET single post by slug
            const post = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1);
            if (!post.length) {
                return res.status(404).json({ error: 'Post not found' });
            }
            return res.status(200).json(post[0]);
        }

        if (req.method === 'PUT') {
            // PUT update post by slug
            const { id: bodyId, createdAt, ...updateData } = req.body;
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
            // DELETE post by slug
            await db.delete(posts).where(eq(posts.slug, slug));
            return res.status(204).end();
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ error: error.message });
    }
}
