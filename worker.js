
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
    mediaType: text('media_type'),
    youtubeUrl: text('youtube_url'),
    carouselImages: text('carousel_images'),
    // Analytics
    viewCount: integer('view_count').default(0),
});

// Settings table for site configuration
const settings = sqliteTable('settings', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    key: text('key').notNull().unique(),
    value: text('value').notNull(),
});

// Analytics table for page views
const analytics = sqliteTable('analytics', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    path: text('path').notNull(),
    timestamp: integer('timestamp', { mode: 'timestamp' }).notNull(),
    date: text('date').notNull(), // YYYY-MM-DD for easy grouping
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

// Ensure analytics table exists
async function ensureAnalyticsTable(env) {
    const client = getClient(env);
    await client.execute(`
        CREATE TABLE IF NOT EXISTS analytics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            path TEXT NOT NULL,
            timestamp INTEGER NOT NULL,
            date TEXT NOT NULL
        )
    `);
}

// Ensure posts table has new columns (for existing databases)
async function ensurePostsColumns(env) {
    const client = getClient(env);
    const columns = ['media_type', 'youtube_url', 'carousel_images', 'view_count'];
    for (const col of columns) {
        try {
            if (col === 'view_count') {
                await client.execute(`ALTER TABLE posts ADD COLUMN ${col} INTEGER DEFAULT 0`);
            } else {
                await client.execute(`ALTER TABLE posts ADD COLUMN ${col} TEXT`);
            }
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

        // 5. Analytics Routes
        if (path.startsWith('/api/analytics')) {
            try {
                await ensureAnalyticsTable(env);
                await ensurePostsColumns(env);
                const db = getDb(env);
                const client = getClient(env);

                // Track page view
                if (path === '/api/analytics/track' && method === 'POST') {
                    const body = await request.json();
                    const { path: pagePath } = body;

                    if (!pagePath) return errorResponse('Path required', 400);

                    const now = new Date();
                    const dateStr = now.toISOString().split('T')[0];

                    // Insert analytics record
                    await db.insert(analytics).values({
                        path: pagePath,
                        timestamp: now,
                        date: dateStr
                    });

                    // If it's a blog post, increment view count
                    if (pagePath.startsWith('/blog/') && pagePath !== '/blog') {
                        const slug = pagePath.split('/blog/')[1];
                        if (slug) {
                            await client.execute({
                                sql: `UPDATE posts SET view_count = COALESCE(view_count, 0) + 1 WHERE slug = ?`,
                                args: [slug]
                            });
                        }
                    }

                    return jsonResponse({ success: true });
                }

                // Get analytics summary
                if (path === '/api/analytics/summary' && method === 'GET') {
                    const today = new Date().toISOString().split('T')[0];

                    // Total views
                    const totalResult = await client.execute('SELECT COUNT(*) as count FROM analytics');
                    const totalViews = totalResult.rows[0]?.count || 0;

                    // Today views
                    const todayResult = await client.execute({
                        sql: 'SELECT COUNT(*) as count FROM analytics WHERE date = ?',
                        args: [today]
                    });
                    const todayViews = todayResult.rows[0]?.count || 0;

                    // Top 5 posts
                    const topPosts = await db.select({
                        id: posts.id,
                        slug: posts.slug,
                        title: posts.title,
                        viewCount: posts.viewCount
                    })
                        .from(posts)
                        .orderBy(desc(posts.viewCount))
                        .limit(5);

                    // Total posts count
                    const postsResult = await client.execute('SELECT COUNT(*) as count FROM posts');
                    const totalPosts = postsResult.rows[0]?.count || 0;

                    return jsonResponse({
                        totalViews,
                        todayViews,
                        totalPosts,
                        topPosts
                    });
                }

                return errorResponse('Method not allowed', 405);
            } catch (err) {
                console.error('Analytics API Error:', err);
                return errorResponse(`Analytics error: ${err.message}`, 500);
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
