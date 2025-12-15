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
                // Use relative URL or same-origin API for production compatibility
                const apiUrl = window.location.hostname === 'localhost'
                    ? 'http://localhost:3001/api/posts'
                    : `${window.location.protocol}//${window.location.hostname}:3001/api/posts`;

                const response = await fetch(apiUrl);
                if (!response.ok) throw new Error('Failed to fetch posts');
                const data = await response.json();

                // Format data to match previous structure
                const formatted = data.map(post => ({
                    ...post,
                    body: post.content, // Map content to body for BlogPostPage
                    tags: typeof post.tags === 'string' ? JSON.parse(post.tags) : post.tags,
                    date: new Date(post.createdAt) // Ensure date object
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
