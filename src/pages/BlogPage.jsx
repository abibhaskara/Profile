/* Abi Bhaskara copyright 2025 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaGithub } from 'react-icons/fa';
import { HiArrowRight, HiClock, HiCalendar } from 'react-icons/hi2';
import { Link } from 'react-router-dom';
import { useBlogPosts } from '../hooks/useBlogPosts';

// Calculate reading time from content
const getReadingTime = (content) => {
    if (!content) return 1;
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
};

// Format date
const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};

// Shimmer loading skeleton
const BlogCardSkeleton = ({ featured = false }) => (
    <div className={`blog-post-card blog-skeleton ${featured ? 'featured' : ''}`}>
        <div className="blog-post-image skeleton-shimmer" />
        <div className="blog-post-content">
            <div className="skeleton-line skeleton-shimmer" style={{ width: '60%', height: '14px' }} />
            <div className="skeleton-line skeleton-shimmer" style={{ width: '90%', height: '20px', marginTop: '12px' }} />
            <div className="skeleton-line skeleton-shimmer" style={{ width: '100%', height: '14px', marginTop: '12px' }} />
            <div className="skeleton-line skeleton-shimmer" style={{ width: '80%', height: '14px', marginTop: '8px' }} />
        </div>
    </div>
);

// Blog Post Card Component
const BlogPostCard = ({ post, featured = false, index }) => {
    const readingTime = getReadingTime(post.content);

    return (
        <motion.article
            className={`blog-post-card ${featured ? 'featured' : ''}`}
            variants={{
                hidden: { opacity: 0, y: 30 },
                show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.6, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }
                }
            }}
            whileHover={{ y: -8, transition: { duration: 0.3, ease: 'easeOut' } }}
        >
            <Link to={`/blog/${post.slug}`} className="blog-post-link">
                <div className="blog-post-image">
                    <img src={post.image} alt={post.title} loading="lazy" />
                    <div className="blog-post-overlay" />
                </div>
                <div className="blog-post-content">
                    <div className="blog-post-meta">
                        <span className="blog-post-date">
                            <HiCalendar />
                            {formatDate(post.createdAt)}
                        </span>
                        <span className="blog-post-reading">
                            <HiClock />
                            {readingTime} min read
                        </span>
                    </div>
                    <h3>{post.title}</h3>
                    <div className="blog-post-tags">
                        {Array.isArray(post.tags) ? post.tags.slice(0, 3).map((tag, i) => (
                            <span key={i} className="blog-tag-pill">{tag}</span>
                        )) : null}
                    </div>
                    <p>{post.description}</p>
                    <div className="blog-post-cta">
                        <span>Read Article</span>
                        <HiArrowRight className="blog-arrow" />
                    </div>
                </div>
            </Link>
        </motion.article>
    );
};

const BlogPage = () => {
    const { posts: blogPosts, isLoading } = useBlogPosts();
    const [visiblePosts, setVisiblePosts] = useState(7);

    const loadMore = () => {
        setVisiblePosts(prev => prev + 6);
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
                        transition={{ duration: 0.7, ease: "easeOut" }}
                    >// Blog</motion.span>
                </div>
            </div>

            <div className="blog-hero">
                <motion.div
                    className="blog-hero-content"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: { staggerChildren: 0.2, delayChildren: 0.1 }
                        }
                    }}
                >
                    {/* Profile Picture */}
                    <motion.div
                        className="blog-profile-pic"
                        variants={{
                            hidden: { opacity: 0, scale: 0.95 },
                            visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut" } }
                        }}
                    >
                        <img src="/blog/profile.jpeg" alt="Profile" />
                    </motion.div>

                    {/* Info Cards */}
                    <div className="blog-info-cards">
                        <motion.div
                            className="blog-name-card"
                            variants={{
                                hidden: { opacity: 0, x: 20 },
                                visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
                            }}
                            whileHover={{ scale: 1.01 }}
                        >
                            <h1>ABI BHASKARA</h1>
                            <p className="blog-role">STUDENT RESEARCHER</p>
                        </motion.div>

                        <div className="blog-stats-row">
                            <motion.div
                                className="blog-stat-card"
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.2, ease: "easeOut" } }
                                }}
                                whileHover={{ y: -4 }}
                            >
                                <span className="stat-value">
                                    {(() => {
                                        const startDate = new Date(2024, 9, 1);
                                        const now = new Date();
                                        const years = (now - startDate) / (1000 * 60 * 60 * 24 * 365);
                                        return years < 1 ? '<1' : Math.floor(years) + '+';
                                    })()}
                                </span>
                                <span className="stat-label">Years Exp.</span>
                            </motion.div>
                            <motion.div
                                className="blog-stat-card"
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.3, ease: "easeOut" } }
                                }}
                                whileHover={{ y: -4 }}
                            >
                                <span className="stat-value">{isLoading ? '...' : blogPosts.length}</span>
                                <span className="stat-label">Articles</span>
                            </motion.div>
                            <motion.div
                                className="blog-stat-card icon-only"
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.4, ease: "easeOut" } }
                                }}
                                whileHover={{ y: -4 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <a href="https://github.com/abibhaskara" target="_blank" rel="noopener noreferrer">
                                    <FaGithub size={24} />
                                </a>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Separator */}
            <motion.div
                className="blog-separator"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }}
            />

            {/* YouTube Video Section */}
            <div className="blog-video-section">
                <motion.div
                    className="blog-video-wrapper"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
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

            {/* Blog Posts Section */}
            <div className="blog-posts-section">
                <motion.div
                    className="blog-posts-grid-v2"
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    variants={{ show: { transition: { staggerChildren: 0.1 } } }}
                >
                    {isLoading ? (
                        <>
                            <BlogCardSkeleton featured />
                            {[1, 2, 3, 4, 5, 6].map(i => <BlogCardSkeleton key={i} />)}
                        </>
                    ) : (
                        blogPosts.slice(0, visiblePosts).map((post, index) => (
                            <BlogPostCard
                                key={post.id || index}
                                post={post}
                                featured={index === 0}
                                index={index}
                            />
                        ))
                    )}
                </motion.div>

                {/* See More Button */}
                {!isLoading && visiblePosts < blogPosts.length && (
                    <motion.div
                        className="blog-see-more"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <motion.button
                            onClick={loadMore}
                            whileHover={{ scale: 1.05, boxShadow: '0 10px 40px rgba(239, 68, 68, 0.3)' }}
                            whileTap={{ scale: 0.95 }}
                        >
                            LOAD MORE ARTICLES
                        </motion.button>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default BlogPage;

