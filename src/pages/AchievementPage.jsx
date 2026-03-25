/* Abi Bhaskara copyright 2025 */
import { useState } from 'react';
import { HiTrophy, HiStar, HiAcademicCap, HiArrowTopRightOnSquare } from 'react-icons/hi2';
import { FaMedal, FaAward, FaCode, FaUsers } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

// Icon mapping for dynamic icons from CMS
const ICON_MAP = {
    HiTrophy, HiStar, HiAcademicCap, HiArrowTopRightOnSquare,
    FaMedal, FaAward, FaCode, FaUsers
};

const DEFAULT_ICON = FaAward;
function getIcon(name) {
    return ICON_MAP[name] || DEFAULT_ICON;
}

const ACHIEVEMENTS_API = '/api/achievements';

const itemTweens = {
    hidden: { opacity: 0, y: 20 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: "easeOut",
        }
    }
};

const textTweens = {
    hidden: { opacity: 0, y: 10 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: "easeOut"
        }
    }
};

// Helper function to convert YouTube URL to embed URL
const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=|youtube\.com\/embed\/)([^&?]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1` : null;
};

const AchievementPage = () => {
    const [achievementsByCat, setAchievementsByCat] = useState({
        competition: [],
        organization: [],
        projects: []
    });
    const [isLoading, setIsLoading] = useState(true);
    const [activeVideo, setActiveVideo] = useState(null);

    useEffect(() => {
        const fetchAchievements = async () => {
            try {
                const res = await fetch(ACHIEVEMENTS_API);
                if (res.ok) {
                    const data = await res.json();
                    const grouped = data.reduce((acc, item) => {
                        if (!acc[item.category]) acc[item.category] = [];
                        acc[item.category].push(item);
                        return acc;
                    }, { competition: [], organization: [], projects: [] });
                    setAchievementsByCat(grouped);
                }
            } catch (error) {
                console.error("Failed to fetch achievements:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAchievements();
    }, []);

    const handleProjectClick = (link) => {
        const embedUrl = getYouTubeEmbedUrl(link);
        if (embedUrl) {
            setActiveVideo(embedUrl);
        } else {
            // If not a YouTube link, open in new tab
            window.open(link, '_blank');
        }
    };

    return (
        <div className="achievement-page">
            <div className="container" style={{ paddingBottom: 0 }}>
                <div className="page-header" style={{ paddingBottom: 0 }}>
                    <motion.span
                        className="section-label"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }} /* Changed to animate for reliable load */
                        transition={{ duration: 0.7, ease: "easeOut" }}
                    >// Achievement</motion.span>
                </div>
            </div>
            <section className="achievement-section">
                <div className="achievement-container">
                    <div className="achievement-sidebar">
                        <motion.h2
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            style={{ position: 'sticky', top: '120px' }}
                        >Organization</motion.h2>
                    </div>
                    <motion.div
                        className="achievement-grid"
                        variants={{
                            hidden: { opacity: 0 },
                            show: {
                                opacity: 1,
                                transition: {
                                    staggerChildren: 0.1,
                                    delayChildren: 0.1,
                                    ease: "easeOut"
                                }
                            }
                        }}
                        initial="hidden"
                        animate="show" // Force immediate load for first section
                    >
                        {achievementsByCat.organization.map((item, index) => {
                            const Icon = getIcon(item.icon);
                            return (
                                <motion.div
                                    key={item.id || index}
                                    className="achievement-item project-card"
                                    variants={itemTweens}
                                    // ... existing props
                                whileHover={{
                                    y: -8,
                                    backgroundColor: "rgba(255, 255, 255, 0.03)",
                                    transition: { duration: 0.2 }
                                }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className="achievement-item-image project-image">
                                    <img src={item.image} alt={item.title} />
                                </div>
                                <div className="achievement-item-content">
                                    <motion.h3 variants={textTweens}>{item.title}</motion.h3>
                                    <motion.p variants={textTweens}>{item.description}</motion.p>
                                    <div className="project-meta">
                                        <motion.span className="achievement-year" variants={textTweens}>{item.year}</motion.span>
                                        <div className="project-icon-wrapper">
                                            <Icon size={20} color="var(--accent)" />
                                        </div>
                                    </div>
                                </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            {/* Competition Section */}
            <section className="achievement-section">
                <div className="achievement-container">
                    <div className="achievement-sidebar">
                        <motion.h2
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            style={{ position: 'sticky', top: '120px' }}
                        >Competition</motion.h2>
                    </div>
                    <motion.div
                        className="achievement-grid"
                        variants={{
                            hidden: { opacity: 0 },
                            show: {
                                opacity: 1,
                                transition: {
                                    staggerChildren: 0.1,
                                    delayChildren: 0.1,
                                    ease: "easeOut"
                                }
                            }
                        }}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.1 }}
                    >
                        {achievementsByCat.competition.map((item, index) => {
                            const Icon = getIcon(item.icon);
                            return (
                                <motion.div
                                    key={item.id || index}
                                    className="achievement-item project-card"
                                    variants={itemTweens}
                                    // ...
                                whileHover={{
                                    y: -8,
                                    backgroundColor: "rgba(255, 255, 255, 0.03)",
                                    transition: { duration: 0.2 }
                                }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className="achievement-item-image project-image">
                                    <img src={item.image} alt={item.title} />
                                </div>
                                <div className="achievement-item-content">
                                    <motion.h3 variants={textTweens}>{item.title}</motion.h3>
                                    <motion.p variants={textTweens}>{item.description}</motion.p>
                                    <div className="project-meta">
                                        <motion.span className="achievement-year" variants={textTweens}>{item.year}</motion.span>
                                        <div className="project-icon-wrapper">
                                            <Icon size={20} color="var(--accent)" />
                                        </div>
                                    </div>
                                </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            {/* Projects Section */}
            <section id="projects" className="achievement-section">
                <div className="achievement-container">
                    <div className="achievement-sidebar">
                        <motion.h2
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            style={{ position: 'sticky', top: '120px' }}
                        >Projects</motion.h2>
                    </div>
                    <motion.div
                        className="achievement-grid"
                        variants={{
                            hidden: { opacity: 0 },
                            show: {
                                opacity: 1,
                                transition: {
                                    staggerChildren: 0.1,
                                    delayChildren: 0.1,
                                    ease: "easeOut"
                                }
                            }
                        }}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.1 }}
                    >
                        {achievementsByCat.projects.map((item, index) => {
                            const Icon = getIcon(item.icon);
                            return (
                                <motion.div
                                    key={item.id || index}
                                    className="achievement-item project-card"
                                    variants={itemTweens}
                                    // ...
                                whileHover={{
                                    y: -8, // Lift up effect for cards
                                    backgroundColor: "rgba(255, 255, 255, 0.03)",
                                    transition: { duration: 0.2 }
                                }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className="achievement-item-image project-image">
                                    <img src={item.image} alt={item.title} />
                                </div>
                                <div className="achievement-item-content">
                                    <motion.h3 variants={textTweens}>{item.title}</motion.h3>
                                    <motion.p variants={textTweens}>{item.description}</motion.p>
                                    <div className="project-meta">
                                        <motion.span className="achievement-year" variants={textTweens}>{item.year}</motion.span>
                                        {item.link ? (
                                            <motion.button
                                                onClick={() => handleProjectClick(item.link)}
                                                className="project-link-btn"
                                                variants={textTweens}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                See Project <HiArrowTopRightOnSquare />
                                            </motion.button>
                                        ) : (
                                            <div className="project-icon-wrapper">
                                                <Icon size={20} color="var(--accent)" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            {/* YouTube Modal */}
            <AnimatePresence>
                {activeVideo && (
                    <motion.div
                        className="video-modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setActiveVideo(null)}
                    >
                        <motion.div
                            className="video-modal-content"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ type: 'spring', damping: 25 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                className="video-modal-close"
                                onClick={() => setActiveVideo(null)}
                            >
                                ✕
                            </button>
                            <iframe
                                src={activeVideo}
                                title="Project Video"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AchievementPage;
