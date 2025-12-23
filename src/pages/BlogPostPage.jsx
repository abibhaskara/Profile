/* Abi Bhaskara copyright 2025 */
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiArrowLeft, HiCalendar, HiTag } from 'react-icons/hi2';
import ReactMarkdown from 'react-markdown';
import { useBlogPosts } from '../hooks/useBlogPosts';
import { useLanguage } from '../context/LanguageContext';

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

// Carousel Slideshow - single image with auto-transition and zoom effect
const CarouselSlideshow = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (images.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '16/9',
            borderRadius: '16px',
            overflow: 'hidden',
            background: 'rgba(0,0,0,0.2)'
        }}>
            <AnimatePresence mode="wait">
                <motion.img
                    key={currentIndex}
                    src={images[currentIndex]}
                    alt={`Slide ${currentIndex + 1}`}
                    initial={{ scale: 1.15, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        position: 'absolute',
                        top: 0,
                        left: 0
                    }}
                />
            </AnimatePresence>
            {/* Slide indicators */}
            {images.length > 1 && (
                <div style={{
                    position: 'absolute',
                    bottom: '16px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: '8px'
                }}>
                    {images.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            style={{
                                width: idx === currentIndex ? '24px' : '8px',
                                height: '8px',
                                borderRadius: '4px',
                                background: idx === currentIndex ? 'white' : 'rgba(255,255,255,0.5)',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const BlogPostPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { posts, isLoading } = useBlogPosts();
    const { language, translateText, isTranslating } = useLanguage();
    const [post, setPost] = useState(null);
    const [notFound, setNotFound] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [translatedContent, setTranslatedContent] = useState({ title: '', content: '' });
    const [showToast, setShowToast] = useState(false);

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

    // Show toast when switching to English
    useEffect(() => {
        if (language === 'en') {
            setShowToast(true);
            const timer = setTimeout(() => setShowToast(false), 3000);
            return () => clearTimeout(timer);
        } else {
            setShowToast(false);
        }
    }, [language]);

    // Translate content when language is English
    useEffect(() => {
        if (language === 'en' && post) {
            const translateContent = async () => {
                const title = await translateText(post.title);
                const content = await translateText(post.content);
                setTranslatedContent({ title, content });
            };
            translateContent();
        }
    }, [language, post, translateText]);

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
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
            {/* Hero Image */}
            <motion.div
                className="post-hero-image"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
            >
                <motion.img
                    src={post.image}
                    alt={post.title}
                    loading="eager"
                    decoding="async"
                    onLoad={() => setImageLoaded(true)}
                    initial={{ scale: 1.15, opacity: 0 }}
                    animate={{
                        scale: imageLoaded ? 1 : 1.15,
                        opacity: imageLoaded ? 1 : 0
                    }}
                    transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                />
                <div className="post-overlay" />
                <div className="container post-hero-content">
                    <motion.button
                        onClick={() => navigate('/blog')}
                        className="back-button"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        whileHover={{ x: -4 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <HiArrowLeft /> Back to Blog
                    </motion.button>
                    <motion.h1
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >
                        {language === 'en' && translatedContent.title ? translatedContent.title : post.title}
                    </motion.h1>
                    <motion.div
                        className="post-meta"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.7 }}
                    >
                        <span className="meta-item">
                            <HiCalendar />
                            {(() => {
                                try {
                                    // Handle different date formats
                                    let date;
                                    if (typeof post.createdAt === 'number') {
                                        // Unix timestamp (could be seconds or milliseconds)
                                        date = post.createdAt > 9999999999
                                            ? new Date(post.createdAt)
                                            : new Date(post.createdAt * 1000);
                                    } else if (typeof post.createdAt === 'string') {
                                        date = new Date(post.createdAt);
                                    } else {
                                        date = new Date(post.createdAt);
                                    }
                                    return isNaN(date.getTime()) ? 'Unknown Date' : date.toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    });
                                } catch {
                                    return 'Unknown Date';
                                }
                            })()}
                        </span>
                        <span className="meta-divider">•</span>
                        <span className="meta-item">
                            <HiTag />
                            {(() => {
                                try {
                                    const parsedTags = typeof post.tags === 'string' ? JSON.parse(post.tags) : post.tags;
                                    return Array.isArray(parsedTags) ? parsedTags.join(', ') : parsedTags;
                                } catch {
                                    return post.tags;
                                }
                            })()}
                        </span>
                    </motion.div>
                </div>
            </motion.div>

            <motion.div
                className="container post-body-container"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
                {/* Post Media Section - inside body container for consistent padding */}
                {post.mediaType && (post.youtubeUrl || post.carouselImages) && (
                    <div style={{ marginBottom: '32px' }}>
                        {post.mediaType === 'youtube' && post.youtubeUrl && (() => {
                            let embedUrl = post.youtubeUrl;
                            if (embedUrl.includes('youtu.be/')) {
                                const videoId = embedUrl.split('youtu.be/')[1].split('?')[0];
                                embedUrl = `https://www.youtube.com/embed/${videoId}`;
                            } else if (embedUrl.includes('watch?v=')) {
                                const videoId = embedUrl.split('watch?v=')[1].split('&')[0];
                                embedUrl = `https://www.youtube.com/embed/${videoId}`;
                            }
                            return (
                                <div style={{ borderRadius: '16px', overflow: 'hidden', aspectRatio: '16/9' }}>
                                    <iframe
                                        src={embedUrl}
                                        style={{ width: '100%', height: '100%', border: 'none' }}
                                        title="Post Video"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </div>
                            );
                        })()}
                        {post.mediaType === 'carousel' && post.carouselImages && (() => {
                            try {
                                const images = typeof post.carouselImages === 'string' ? JSON.parse(post.carouselImages) : post.carouselImages;
                                if (!Array.isArray(images) || images.length === 0) return null;
                                return <CarouselSlideshow images={images} />;
                            } catch { return null; }
                        })()}
                    </div>
                )}

                <article className="post-content">
                    <ReactMarkdown>
                        {language === 'en' && translatedContent.content ? translatedContent.content : post.content}
                    </ReactMarkdown>
                </article>
            </motion.div>

            {/* Auto-translated toast popup */}
            <AnimatePresence>
                {showToast && (
                    <motion.div
                        className="auto-translated-toast"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                    >
                        <span>🤖 Auto-translated</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default BlogPostPage;

