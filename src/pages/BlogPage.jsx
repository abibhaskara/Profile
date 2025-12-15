/* Abi Bhaskara copyright 2025 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaGithub } from 'react-icons/fa';
import { HiArrowRight } from 'react-icons/hi2';
import { Link } from 'react-router-dom';
import { useBlogPosts } from '../hooks/useBlogPosts';

// Bento Blog Card Component
const BentoCard = ({ post, size = 'normal', index }) => {
    const sizeClass = size === 'large' ? 'bento-large' : size === 'wide' ? 'bento-wide' : '';

    return (
        <motion.article
            className={`bento-card ${sizeClass}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            whileHover={{ scale: 1.02 }}
        >
            <Link to={`/blog/${post.slug}`} className="bento-link">
                <div className="bento-image">
                    <img src={post.image} alt={post.title} loading="lazy" />
                    <div className="bento-overlay" />
                </div>
                <div className="bento-content">
                    <div className="bento-header">
                        <span className="bento-tag">
                            {Array.isArray(post.tags) ? post.tags[0] : 'Article'}
                        </span>
                        <motion.div
                            className="bento-arrow"
                            whileHover={{ x: 4 }}
                        >
                            <HiArrowRight />
                        </motion.div>
                    </div>
                    <div className="bento-info">
                        <h3>{post.title}</h3>
                        <p>{post.description}</p>
                        <span className="bento-read-more">Read More →</span>
                    </div>
                </div>
            </Link>
        </motion.article>
    );
};

// Skeleton for loading
const BentoSkeleton = ({ size = 'normal' }) => (
    <div className={`bento-card bento-skeleton ${size === 'large' ? 'bento-large' : ''}`}>
        <div className="bento-image skeleton-shimmer" />
    </div>
);

const BlogPage = () => {
    const { posts: blogPosts, isLoading } = useBlogPosts();
    const [visiblePosts, setVisiblePosts] = useState(7);

    const loadMore = () => setVisiblePosts(prev => prev + 6);

    // Get card size based on index
    const getCardSize = (index) => {
        if (index === 0) return 'large';
        if (index === 1) return 'wide';
        return 'normal';
    };

    return (
        <div className="blog-page">
            <div className="container" style={{ paddingBottom: 0 }}>
                <div className="page-header" style={{ paddingBottom: '40px' }}>
                    <motion.span
                        className="section-label"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                    >// Blog</motion.span>
                </div>
            </div>

            {/* Hero Section */}
            <div className="blog-hero">
                <motion.div
                    className="blog-hero-content"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
                    }}
                >
                    <motion.div
                        className="blog-profile-pic"
                        variants={{
                            hidden: { opacity: 0, scale: 0.95 },
                            visible: { opacity: 1, scale: 1, transition: { duration: 0.8 } }
                        }}
                    >
                        <img src="/blog/profile.jpeg" alt="Profile" />
                    </motion.div>

                    <div className="blog-info-cards">
                        <motion.div
                            className="blog-name-card"
                            variants={{
                                hidden: { opacity: 0, x: 20 },
                                visible: { opacity: 1, x: 0, transition: { duration: 0.8 } }
                            }}
                            whileHover={{ scale: 1.01 }}
                        >
                            <h1>ABI BHASKARA</h1>
                            <p className="blog-role">STUDENT RESEARCHER</p>
                        </motion.div>

                        <div className="blog-stats-row">
                            <motion.div className="blog-stat-card" whileHover={{ y: -4 }}
                                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { delay: 0.2 } } }}>
                                <span className="stat-value">
                                    {(() => {
                                        const years = (new Date() - new Date(2024, 9, 1)) / (1000 * 60 * 60 * 24 * 365);
                                        return years < 1 ? '<1' : Math.floor(years) + '+';
                                    })()}
                                </span>
                                <span className="stat-label">Years Exp.</span>
                            </motion.div>
                            <motion.div className="blog-stat-card" whileHover={{ y: -4 }}
                                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { delay: 0.3 } } }}>
                                <span className="stat-value">{isLoading ? '...' : blogPosts.length}</span>
                                <span className="stat-label">Articles</span>
                            </motion.div>
                            <motion.div className="blog-stat-card icon-only" whileHover={{ y: -4 }} whileTap={{ scale: 0.9 }}
                                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { delay: 0.4 } } }}>
                                <a href="https://github.com/abibhaskara" target="_blank" rel="noopener noreferrer">
                                    <FaGithub size={24} />
                                </a>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>

            <motion.div className="blog-separator" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1, delay: 0.5 }} />

            {/* YouTube Video */}
            <div className="blog-video-section">
                <motion.div
                    className="blog-video-wrapper"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <iframe
                        src="https://www.youtube.com/embed/R5fsvSonpoY?si=xR3bw69G7u-OoGbJ"
                        title="YouTube video"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </motion.div>
            </div>

            {/* Bento Grid */}
            <div className="blog-posts-section">
                <div className="bento-grid">
                    {isLoading ? (
                        <>
                            <BentoSkeleton size="large" />
                            <BentoSkeleton size="wide" />
                            {[1, 2, 3, 4].map(i => <BentoSkeleton key={i} />)}
                        </>
                    ) : (
                        blogPosts.slice(0, visiblePosts).map((post, index) => (
                            <BentoCard
                                key={post.id || index}
                                post={post}
                                size={getCardSize(index)}
                                index={index}
                            />
                        ))
                    )}
                </div>

                {!isLoading && visiblePosts < blogPosts.length && (
                    <motion.div className="blog-see-more" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                        <motion.button
                            onClick={loadMore}
                            whileHover={{ scale: 1.05, boxShadow: '0 10px 40px rgba(239, 68, 68, 0.3)' }}
                            whileTap={{ scale: 0.95 }}
                        >
                            LOAD MORE
                        </motion.button>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default BlogPage;
