/* Abi Bhaskara copyright 2025 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaGithub } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useBlogPosts } from '../hooks/useBlogPosts';

const BlogPage = () => {
    const { posts: blogPosts, isLoading } = useBlogPosts();
    const [visiblePosts, setVisiblePosts] = useState(6);

    const loadMore = () => {
        setVisiblePosts(prev => prev + 3);
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
                        hidden: { opacity: 0, transition: { duration: 0 } }, // Force instant hide
                        visible: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.2,
                                delayChildren: 0.1
                            }
                        }
                    }}
                >
                    {/* Profile Picture */}
                    <motion.div
                        className="blog-profile-pic"
                        variants={{
                            hidden: { opacity: 0, scale: 0.9, y: 10 },
                            visible: {
                                opacity: 1,
                                scale: 1,
                                y: 0,
                                transition: { duration: 0.8, ease: "easeOut" } // Tween
                            }
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
                                visible: {
                                    opacity: 1,
                                    x: 0,
                                    transition: { duration: 0.8, ease: "easeOut" } // Tween
                                }
                            }}
                            whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
                        >
                            <h1>ABI BHASKARA</h1>
                            <p className="blog-role">STUDENT RESEARCHER</p>
                        </motion.div>

                        <div className="blog-stats-row">
                            <motion.div
                                className="blog-stat-card"
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: {
                                        opacity: 1,
                                        y: 0,
                                        transition: { duration: 0.8, delay: 0.2, ease: "easeOut" }
                                    }
                                }}
                                whileHover={{ y: -4, transition: { duration: 0.2 } }} // Added hover
                            >
                                <span className="stat-value">
                                    {(() => {
                                        // Calculate years since October 2024
                                        const startDate = new Date(2024, 9, 1); // October 2024 (month is 0-indexed)
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
                                    visible: {
                                        opacity: 1,
                                        y: 0,
                                        transition: { duration: 0.8, delay: 0.3, ease: "easeOut" }
                                    }
                                }}
                                whileHover={{ y: -4, transition: { duration: 0.2 } }} // Added hover
                            >
                                <span className="stat-value">{isLoading ? '...' : blogPosts.length}</span>
                                <span className="stat-label">Articles</span>
                            </motion.div>
                            <motion.div
                                className="blog-stat-card icon-only"
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: {
                                        opacity: 1,
                                        y: 0,
                                        transition: { duration: 0.8, delay: 0.4, ease: "easeOut" }
                                    }
                                }}
                                whileHover={{ y: -4, transition: { duration: 0.2 } }} // Added hover
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
            ></motion.div>

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
                    ></iframe>
                </motion.div>
            </div>

            {/* Blog Posts Grid */}
            <div className="blog-posts-section">
                <motion.div
                    className="blog-posts-grid"
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    variants={{
                        show: {
                            transition: {
                                staggerChildren: 0.1
                            }
                        }
                    }}
                >
                    {/* Loading State or Posts */}
                    {isLoading ? (
                        <div style={{ color: 'var(--text-secondary)', textAlign: 'center', gridColumn: '1/-1', padding: '40px' }}>
                            Loading articles...
                        </div>
                    ) : blogPosts.slice(0, visiblePosts).map((post, index) => (
                        <motion.article
                            key={post.id || index}
                            className="blog-post-card"
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                show: {
                                    opacity: 1,
                                    y: 0,
                                    transition: { duration: 0.6, ease: "easeOut" }
                                }
                            }}
                            whileHover={{ y: -4, transition: { duration: 0.2, ease: "easeOut" } }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Link to={`/blog/${post.slug}`} className="blog-post-link">
                                <div className="blog-post-image">
                                    <img src={post.image} alt={post.title} />
                                </div>
                                <div className="blog-post-content">
                                    <h3>{post.title}</h3>
                                    <div className="blog-post-tags">
                                        {Array.isArray(post.tags) ? post.tags.join(' • ') : post.tags}
                                    </div>
                                    <p>{post.description}</p>
                                </div>
                            </Link>
                        </motion.article>
                    ))}
                </motion.div>

                {/* See More Button */}
                {!isLoading && visiblePosts < blogPosts.length && (
                    <motion.div
                        className="blog-see-more"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                    >
                        <motion.button
                            onClick={loadMore}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >SEE MORE</motion.button>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default BlogPage;
