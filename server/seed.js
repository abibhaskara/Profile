/* Abi Bhaskara copyright 2025 */
import fs from 'fs';
import path from 'path';
import fm from 'front-matter';
import { db } from './db/index.js';
import { posts } from './db/schema.js';

const seed = async () => {
    console.log('Seeding database...');
    const blogDir = path.join(process.cwd(), 'src/content/blog');

    if (!fs.existsSync(blogDir)) {
        console.log('No blog content found to seed.');
        return;
    }

    const files = fs.readdirSync(blogDir).filter(file => file.endsWith('.md'));

    for (const file of files) {
        const content = fs.readFileSync(path.join(blogDir, file), 'utf8');
        const parsed = fm(content);
        const slug = file.replace('.md', '');

        try {
            await db.insert(posts).values({
                slug,
                title: parsed.attributes.title,
                date: new Date(parsed.attributes.date),
                tags: JSON.stringify(parsed.attributes.tags),
                description: parsed.attributes.description,
                image: parsed.attributes.image,
                content: parsed.body,
                createdAt: new Date(parsed.attributes.date)
            }).onConflictDoUpdate({
                target: posts.slug,
                set: {
                    title: parsed.attributes.title,
                    content: parsed.body,
                    description: parsed.attributes.description,
                    image: parsed.attributes.image,
                    tags: JSON.stringify(parsed.attributes.tags)
                }
            });
            console.log(`Seeded: ${slug}`);
        } catch (error) {
            console.error(`Failed to seed ${slug}:`, error);
        }
    }
    console.log('Seeding complete!');
};

seed();
