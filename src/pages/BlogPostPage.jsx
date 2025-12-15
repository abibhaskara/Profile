/* Abi Bhaskara copyright 2025 */
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiArrowLeft, HiCalendar, HiTag } from 'react-icons/hi2';
import ReactMarkdown from 'react-markdown';
import { useBlogPosts } from '../hooks/useBlogPosts';

// Skeleton loading component
const BlogPostSkeleton = () => (
    <div className="blog-post-page">
        <div className="post-hero-image" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div className="container post-hero-content">
                <div style={{
                    width: '120px',
                    height: '40px',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '20px',
                    marginBottom: '16px'
                }} />
                <div style={{
                    width: '80%',
                    height: '48px',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    marginBottom: '16px'
                }} />
                <div style={{
                    width: '200px',
                    height: '20px',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '4px'
                }} />
            </div>
        </div>
        <div className="container post-body-container">
            <div className="post-content">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} style={{
                        width: `${100 - i * 10}%`,
                        height: '20px',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '4px',
                        marginBottom: '12px'
                    }} />
                ))}
            </div>
        </div>
    </div>
);

const BlogPostPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { posts, isLoading } = useBlogPosts();
    const [post, setPost] = useState(null);
    const [notFound, setNotFound] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
        if (!isLoading) {
            const foundPost = posts.find(p => p.slug === slug);
            if (foundPost) {
                setPost(foundPost);
                setNotFound(false);
            } else {
                setNotFound(true);
            }
        }
    }, [slug, posts, isLoading, navigate]);

    // Show skeleton while loading
    if (isLoading) {
        return <BlogPostSkeleton />;
    }

    // Show 404 message if post not found
    if (notFound) {
        return (
            <div className="page not-found-page" style={{ paddingTop: '120px' }}>
                <div className="container">
                    <motion.div
                        className="not-found-content"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1>Post Not Found</h1>
                        <p>The blog post you're looking for doesn't exist or has been removed.</p>
                        <div className="not-found-actions">
                            <motion.button
                                onClick={() => navigate('/blog')}
                                className="btn-primary"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <HiArrowLeft /> Back to Blog
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    // Still loading post data
    if (!post) {
        return <BlogPostSkeleton />;
    }

    return (
        <motion.div
            className="blog-post-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Hero Image */}
            <div className="post-hero-image">
                <img
                    src={post.image}
                    alt={post.title}
                    loading="lazy"
                    decoding="async"
                    onLoad={() => setImageLoaded(true)}
                    style={{
                        opacity: imageLoaded ? 1 : 0,
                        transition: 'opacity 0.3s ease-in-out'
                    }}
                />
                <div className="post-overlay"></div>
                <div className="container post-hero-content">
                    <motion.button
                        onClick={() => navigate('/blog')}
                        className="back-button"
                        whileHover={{ x: -4 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <HiArrowLeft /> Back to Blog
                    </motion.button>
                    <h1>{post.title}</h1>
                    <div className="post-meta">
                        <span className="meta-item">
                            <HiCalendar />
                            {new Date(post.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </span>
                        <span className="meta-divider">•</span>
                        <span className="meta-item">
                            <HiTag />
                            {Array.isArray(post.tags) ? post.tags.join(', ') : post.tags}
                        </span>
                    </div>
                </div>
            </div>

            <div className="container post-body-container">
                <article className="post-content">
                    <ReactMarkdown>{post.body}</ReactMarkdown>
                </article>
            </div>
        </motion.div>
    );
};

export default BlogPostPage;

