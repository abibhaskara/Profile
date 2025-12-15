/* Abi Bhaskara copyright 2025 */
import express from 'express';
import { db } from '../db/index.js';
import { posts } from '../db/schema.js';
import { eq, desc } from 'drizzle-orm';

const router = express.Router();

// GET all posts
router.get('/', async (req, res) => {
    try {
        const allPosts = await db.select().from(posts).orderBy(desc(posts.createdAt));
        res.json(allPosts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET single post by slug
router.get('/:slug', async (req, res) => {
    try {
        const post = await db.select().from(posts).where(eq(posts.slug, req.params.slug)).limit(1);
        if (!post.length) return res.status(404).json({ error: 'Post not found' });
        res.json(post[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST create new post
router.post('/', async (req, res) => {
    try {
        const newPost = await db.insert(posts).values({
            ...req.body,
            createdAt: new Date(),
        }).returning();
        res.status(201).json(newPost[0]);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PUT update post
router.put('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid ID' });
        }

        // Remove id from body to avoid overwriting
        const { id: bodyId, createdAt, ...updateData } = req.body;

        const updatedPost = await db.update(posts)
            .set(updateData)
            .where(eq(posts.id, id))
            .returning();

        if (!updatedPost.length) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.json(updatedPost[0]);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE post
router.delete('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid ID' });
        }
        await db.delete(posts).where(eq(posts.id, id));
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;

