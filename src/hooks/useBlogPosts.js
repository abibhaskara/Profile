/* Abi Bhaskara copyright 2025 */
import { useEffect, useState } from 'react';

/**
 * Custom hook to load markdown blog posts from src/content/blog
 * Uses Vite's import.meta.glob for efficient bundling
 */
export const useBlogPosts = () => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadPosts = async () => {
            try {
                // Use relative URL for production (Vercel) or localhost for dev
                const apiUrl = import.meta.env.DEV
                    ? 'http://localhost:3001/api/posts'
                    : '/api/posts';

                const response = await fetch(apiUrl);
                if (!response.ok) throw new Error('Failed to fetch posts');
                const data = await response.json();

                // Parse tags from JSON string, keep other fields as-is
                const formatted = data.map(post => ({
                    ...post,
                    tags: typeof post.tags === 'string' ? JSON.parse(post.tags) : post.tags
                }));

                setPosts(formatted);
            } catch (error) {
                console.error("Failed to load blog posts:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadPosts();
    }, []);

    return { posts, isLoading };
};
