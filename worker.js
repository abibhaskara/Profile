
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { eq, desc } from 'drizzle-orm';

// --- Schema Definition (Copied from db.js) ---
const posts = sqliteTable('posts', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    slug: text('slug').notNull().unique(),
    title: text('title').notNull(),
    content: text('content').notNull(),
    description: text('description'),
    image: text('image'),
    tags: text('tags'),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    // Per-post media settings
    mediaType: text('media_type'), // 'youtube' | 'carousel' | null
    youtubeUrl: text('youtube_url'),
    carouselImages: text('carousel_images'), // JSON array
});

// Settings table for site configuration
const settings = sqliteTable('settings', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    key: text('key').notNull().unique(),
    value: text('value').notNull(),
});

// --- Helper Functions ---

function getClient(env) {
    return createClient({
        url: env.TURSO_DATABASE_URL,
        authToken: env.TURSO_AUTH_TOKEN,
    });
}

function getDb(env) {
    const client = getClient(env);
    return drizzle(client, { schema: { posts, settings } });
}

// Ensure settings table exists
async function ensureSettingsTable(env) {
    const client = getClient(env);
    await client.execute(`
        CREATE TABLE IF NOT EXISTS settings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            key TEXT NOT NULL UNIQUE,
            value TEXT NOT NULL
        )
    `);
}

// Ensure posts table has media columns (for existing databases)
async function ensurePostsColumns(env) {
    const client = getClient(env);
    // Add columns if they don't exist (SQLite will error if column exists, so we use try-catch)
    const columns = ['media_type', 'youtube_url', 'carousel_images'];
    for (const col of columns) {
        try {
            await client.execute(`ALTER TABLE posts ADD COLUMN ${col} TEXT`);
        } catch (e) {
            // Column likely already exists, ignore
        }
    }
}

function setCorsHeaders(res) {
    res.headers.set('Access-Control-Allow-Origin', '*');
    res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res;
}

function jsonResponse(data, status = 200) {
    const res = new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json' }
    });
    return setCorsHeaders(res);
}

function errorResponse(message, status = 500) {
    return jsonResponse({ error: message }, status);
}

// --- Cloudinary Logic ---

async function uploadToCloudinary(image, env) {
    const cloudName = env.CLOUDINARY_CLOUD_NAME;
    const apiKey = env.CLOUDINARY_API_KEY;
    const apiSecret = env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
        throw new Error('Cloudinary configuration missing');
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = 'portfolio-blog';

    // Generate Signature using Web Crypto
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const enc = new TextEncoder();
    const algorithm = { name: 'SHA-1' };
    const hashBuffer = await crypto.subtle.digest(algorithm, enc.encode(paramsToSign));
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const signature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    const formData = new FormData();
    formData.append('file', image);
    formData.append('api_key', apiKey);
    formData.append('timestamp', timestamp);
    formData.append('folder', folder);
    formData.append('signature', signature);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || 'Cloudinary upload failed');
    }

    return await response.json();
}

// --- Main Worker Handler ---

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const path = url.pathname;
        const method = request.method;

        // Handle CORS Preflight
        if (method === 'OPTIONS') {
            const res = new Response(null, { status: 204 });
            return setCorsHeaders(res);
        }

        // --- API Routes ---

        // 1. Upload Route
        if (path === '/api/upload' && method === 'POST') {
            try {
                const body = await request.json();
                const { image } = body;
                if (!image) return errorResponse('No image provided', 400);

                const result = await uploadToCloudinary(image, env);
                return jsonResponse({
                    url: result.secure_url,
                    public_id: result.public_id,
                    width: result.width,
                    height: result.height
                });
            } catch (err) {
                console.error('Upload Error:', err);
                return errorResponse(err.message || 'Upload failed');
            }
        }

        // 2. Posts List / Create
        if (path === '/api/posts') {
            try {
                // Ensure posts table has media columns
                await ensurePostsColumns(env);
                const db = getDb(env);

                if (method === 'GET') {
                    const allPosts = await db.select().from(posts).orderBy(desc(posts.createdAt));
                    return jsonResponse(allPosts);
                }
                if (method === 'POST') {
                    const body = await request.json();
                    const { slug, title, content, description, image, tags, mediaType, youtubeUrl, carouselImages } = body;

                    if (!slug || !title || !content) {
                        return errorResponse('Missing required fields', 400);
                    }

                    const newPost = await db.insert(posts).values({
                        slug: slug.trim(),
                        title: title.trim(),
                        content,
                        description: description || '',
                        image: image || '',
                        tags: tags || '[]',
                        createdAt: new Date(),
                        mediaType: mediaType || null,
                        youtubeUrl: youtubeUrl || null,
                        carouselImages: carouselImages || null,
                    }).returning();

                    return jsonResponse(newPost[0], 201);
                }
                return errorResponse('Method not allowed', 405);
            } catch (err) {
                console.error('API Error:', err);
                return errorResponse('Internal Server Error');
            }
        }

        // 3. Single Post Options
        if (path.startsWith('/api/posts/')) {
            const slug = path.split('/').pop();
            if (!slug) return errorResponse('Slug required', 400);

            const db = getDb(env);
            try {
                if (method === 'GET') {
                    const post = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1);
                    if (!post.length) return errorResponse('Post not found', 404);
                    return jsonResponse(post[0]);
                }
                if (method === 'PUT') {
                    const body = await request.json();
                    // Remove id and createdAt from update payload if present
                    const { id, createdAt, ...updateData } = body;

                    if (Object.keys(updateData).length === 0) return errorResponse('No update data', 400);

                    const updatedPost = await db.update(posts)
                        .set(updateData)
                        .where(eq(posts.slug, slug))
                        .returning();

                    if (!updatedPost.length) return errorResponse('Post not found', 404);
                    return jsonResponse(updatedPost[0]);
                }
                if (method === 'DELETE') {
                    await db.delete(posts).where(eq(posts.slug, slug));
                    return new Response(null, { status: 204 });
                }
                return errorResponse('Method not allowed', 405);
            } catch (err) {
                console.error('API Error:', err);
                return errorResponse('Internal Server Error');
            }
        }

        // 4. Settings Routes
        if (path.startsWith('/api/settings')) {
            const settingKey = path.split('/').pop();

            try {
                // Ensure settings table exists before any query
                await ensureSettingsTable(env);
                const db = getDb(env);

                if (method === 'GET' && settingKey && settingKey !== 'settings') {
                    const setting = await db.select().from(settings).where(eq(settings.key, settingKey)).limit(1);
                    if (!setting.length) {
                        return jsonResponse({ key: settingKey, value: null });
                    }
                    return jsonResponse({
                        key: setting[0].key,
                        value: JSON.parse(setting[0].value)
                    });
                }
                if (method === 'PUT' && settingKey && settingKey !== 'settings') {
                    const body = await request.json();
                    const valueStr = JSON.stringify(body.value);

                    // Check if setting exists
                    const existing = await db.select().from(settings).where(eq(settings.key, settingKey)).limit(1);

                    if (existing.length) {
                        // Update existing
                        await db.update(settings)
                            .set({ value: valueStr })
                            .where(eq(settings.key, settingKey));
                    } else {
                        // Insert new
                        await db.insert(settings).values({
                            key: settingKey,
                            value: valueStr
                        });
                    }

                    return jsonResponse({ key: settingKey, value: body.value });
                }
                return errorResponse('Method not allowed', 405);
            } catch (err) {
                console.error('Settings API Error:', err);
                return errorResponse(`Settings error: ${err.message}`, 500);
            }
        }

        // --- Static Assets (SPA Fallback) ---
        if (env.ASSETS) {
            const response = await env.ASSETS.fetch(request);
            if (response.status === 404 && !path.startsWith('/api/')) {
                return env.ASSETS.fetch(new Request(new URL('/index.html', request.url), request));
            }
            return response;
        }

        return new Response('Not Found', { status: 404 });
    }
};
