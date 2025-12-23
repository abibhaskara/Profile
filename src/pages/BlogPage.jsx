/* Abi Bhaskara copyright 2025 */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub } from 'react-icons/fa';
import { HiArrowRight, HiMagnifyingGlass } from 'react-icons/hi2';
import { Link } from 'react-router-dom';
import { useBlogPosts } from '../hooks/useBlogPosts';
import { useLanguage } from '../context/LanguageContext';

// Bento Blog Card Component
const BentoCard = ({ post, size = 'normal', index, translatedTitle, translatedDescription }) => {
    const sizeClass = size === 'large' ? 'bento-large' : size === 'wide' ? 'bento-wide' : '';

    return (
        <motion.article
            className={`bento-card ${sizeClass}`}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
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
                        <h3>{translatedTitle || post.title}</h3>
                        <p>{translatedDescription || post.description}</p>
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

// Photo Carousel Component with auto-swipe
const PhotoCarousel = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (images.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [images.length]);

    if (!images || images.length === 0) return null;

    return (
        <div className="blog-carousel">
            <div className="carousel-slides">
                <AnimatePresence mode="wait">
                    <motion.img
                        key={currentIndex}
                        src={images[currentIndex]}
                        alt={`Slide ${currentIndex + 1}`}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                    />
                </AnimatePresence>
            </div>
            {images.length > 1 && (
                <div className="carousel-dots">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
                            onClick={() => setCurrentIndex(index)}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const BlogPage = () => {
    const { posts: blogPosts, isLoading } = useBlogPosts();
    const { language, setLanguage, translateText, isTranslating } = useLanguage();
    const [searchQuery, setSearchQuery] = useState('');
    const [visiblePosts, setVisiblePosts] = useState(4);
    const [headerSettings, setHeaderSettings] = useState(null);
    const [translations, setTranslations] = useState({});

    // Fetch header settings
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const API = import.meta.env.DEV ? 'http://localhost:3001/api/settings' : '/api/settings';
                const res = await fetch(`${API}/blogHeader`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.value) {
                        setHeaderSettings(data.value);
                    }
                }
            } catch (err) {
                console.error('Failed to fetch header settings:', err);
            }
        };
        fetchSettings();
    }, []);

    // Translate posts when language changes to English
    useEffect(() => {
        if (language === 'en' && blogPosts.length > 0) {
            const translatePosts = async () => {
                const newTranslations = {};
                for (const post of blogPosts) {
                    if (!translations[post.id]) {
                        const translatedTitle = await translateText(post.title);
                        const translatedDescription = await translateText(post.description);
                        newTranslations[post.id] = { title: translatedTitle, description: translatedDescription };
                    }
                }
                if (Object.keys(newTranslations).length > 0) {
                    setTranslations(prev => ({ ...prev, ...newTranslations }));
                }
            };
            translatePosts();
        }
    }, [language, blogPosts, translateText]);

    const loadMore = () => setVisiblePosts(prev => prev + 6);

    const filteredPosts = blogPosts.filter(post => {
        const query = searchQuery.toLowerCase();
        const searchTags = Array.isArray(post.tags) ? post.tags : (typeof post.tags === 'string' ? JSON.parse(post.tags) : []);

        return (
            post.title?.toLowerCase().includes(query) ||
            post.description?.toLowerCase().includes(query) ||
            searchTags.some(tag => tag.toLowerCase().includes(query))
        );
    });

    // Get card size based on index
    const getCardSize = (index) => {
        if (searchQuery) return 'normal';
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

            {/* Dynamic Header Media */}
            {headerSettings && (
                <div className="blog-video-section">
                    {headerSettings.mediaType === 'youtube' && headerSettings.youtubeUrl && (
                        <motion.div
                            className="blog-video-wrapper"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <iframe
                                src={headerSettings.youtubeUrl.replace('watch?v=', 'embed/').split('&')[0]}
                                title="YouTube video"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </motion.div>
                    )}
                    {headerSettings.mediaType === 'carousel' && headerSettings.carouselImages?.length > 0 && (
                        <motion.div
                            className="blog-video-wrapper"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <PhotoCarousel images={headerSettings.carouselImages} />
                        </motion.div>
                    )}
                </div>
            )}

            {/* Bento Grid */}
            <div className="blog-posts-section">
                {/* Search Bar and Language Toggle */}
                <div className="blog-search-container">
                    <div className="blog-search-wrapper">
                        <HiMagnifyingGlass className="blog-search-icon" />
                        <input
                            type="text"
                            placeholder={language === 'id' ? 'Cari artikel...' : 'Search articles...'}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="blog-search-input"
                        />
                    </div>

                    {/* Language Toggle */}
                    <div className="language-toggle">
                        <button
                            className={`lang-btn ${language === 'id' ? 'active' : ''}`}
                            onClick={() => setLanguage('id')}
                        >
                            ID
                        </button>
                        <button
                            className={`lang-btn ${language === 'en' ? 'active' : ''}`}
                            onClick={() => setLanguage('en')}
                        >
                            EN
                        </button>
                    </div>
                </div>

                {/* Auto-translated notice */}
                {language === 'en' && (
                    <motion.div
                        className="auto-translated-badge"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        🤖 Auto-translated {isTranslating && '(translating...)'}
                    </motion.div>
                )}

                <div className="bento-grid">
                    {isLoading ? (
                        <>
                            <BentoSkeleton size="large" />
                            <BentoSkeleton size="wide" />
                            {[1, 2, 3, 4].map(i => <BentoSkeleton key={i} />)}
                        </>
                    ) : (
                        filteredPosts.slice(0, visiblePosts).map((post, index) => (
                            <BentoCard
                                key={post.id || index}
                                post={post}
                                size={getCardSize(index)}
                                index={index}
                                translatedTitle={language === 'en' ? translations[post.id]?.title : null}
                                translatedDescription={language === 'en' ? translations[post.id]?.description : null}
                            />
                        ))
                    )}
                </div>

                {!isLoading && visiblePosts < filteredPosts.length && (
                    <div className="load-more-container">
                        <button onClick={loadMore} className="load-more-btn">
                            Load More <HiArrowRight />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogPage;
