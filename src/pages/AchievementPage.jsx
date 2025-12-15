/* Abi Bhaskara copyright 2025 */
import { useState } from 'react';
import { HiTrophy, HiStar, HiAcademicCap, HiArrowTopRightOnSquare } from 'react-icons/hi2';
import { FaMedal, FaAward, FaCode, FaUsers } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const achievements = {
    competition: [
        {
            title: "Silver Medalist - Thailand Inventors' Day",
            description: "Invented Peel and Petal, a paper soap made from butterfly pea flowers and leftover orange peels. It helps the environment by turning organic waste into a useful, natural product.",
            year: "2025",
            icon: FaMedal,
            image: "/achievements/Silver Medalist - Thailand Inventors' Day.jpeg"
        },
        {
            title: "Silver Medalist - Japan Design, Idea, and Invention Expo",
            description: "Invented GESTIC AI, AI-powered software that translates sign language using a standard computer. It focuses on recognizing single gestures, such as letters, one by one.",
            year: "2025",
            icon: FaMedal,
            image: "/achievements/Silver Medalist - Japan Design, Idea, and Invention Expo.jpeg"
        },
        {
            title: "Gold Medal - World Youth Invention and Innovation Award",
            description: "CINCA is a natural anti-fungal innovation derived from Green Grass Jelly leaves, designed to combat skin infections caused by floodwaters.",
            year: "2025",
            icon: HiTrophy,
            image: "/achievements/Gold Medal - World Youth Invention and Innovation Award.jpeg"
        },
        {
            title: "Gold Medal - International Science and Invention Fair",
            description: "Invented GESTIC AI 2.0, a web-based AI application that utilizes standard devices to translate real-time sign language into text and sound with 95% accuracy.",
            year: "2025",
            icon: HiTrophy,
            image: "/achievements/Gold Medal - International Science and Invention Fair.png"
        },
        {
            title: "Most Outstanding Student in ICT",
            description: "Awarded at graduation, recognizing exceptional technical proficiency and advanced coding capabilities.",
            year: "2024",
            icon: HiAcademicCap,
            image: "/achievements/Most Outstanding Student in ICT.png"
        },
        {
            title: "Junior High School Top Academic Achiever",
            description: "Consistently achieved the 1st rank across all semesters, maintaining the highest academic standing throughout the entire Junior High School tenure.",
            year: "2024",
            icon: HiAcademicCap,
            image: "/achievements/Junior High School Top Academic Achiever.png"
        },
        {
            title: "Winner of Siswa Siswi Berprestasi",
            description: "Led community empowerment efforts in Bali under the 'Motivation for Education' vision.",
            year: "2022",
            icon: FaAward,
            image: "/achievements/Winner of Siswa Siswi Berprestasi.png"
        }
    ],
    organization: [
        {
            title: "Titik Awal Volunteer",
            description: "As a Creative Team member, I drove community engagement through strategic visual storytelling and impactful media.",
            year: "2025 - Present",
            icon: FaUsers,
            image: "/achievements/Titik Awal Volunteer.JPG"
        },
        {
            title: "SatuPadu Volunteer",
            description: "Volunteered at Penarukan refugee location to promote education equality, creating gamification materials and teaching English & ICT.",
            year: "2025",
            icon: FaUsers,
            image: "/achievements/SatuPadu Volunteer.JPG"
        },
        {
            title: "Student Council President",
            description: "Student Council President Taman Rama Junior High School 2023/2024. Spearheaded over 10 strategic initiatives designed to enhance the quality of education and boost student motivation within the school environment.",
            year: "2023 - 2024",
            icon: HiStar,
            image: "/achievements/Student Council President.jpeg"
        },
        {
            title: "Duta Pendidikan Provinsi Bali",
            description: "Driven by 'Motivation for Education', spearheaded initiatives to empower communities and elevate regional educational quality.",
            year: "2022 - 2023",
            icon: FaAward,
            image: "/achievements/Duta Pendidikan Provinsi Bali.jpeg"
        }
    ],
    projects: [
        {
            title: "Fit+",
            description: "An AI-powered lifestyle platform developed to help reduce diabetes rates by promoting healthier habits and personalized wellness recommendations.",
            year: "2025",
            icon: FaCode,
            image: "/achievements/FIT+.png",
            link: "https://fitplus-bernouli.netlify.app"
        },
        {
            title: "GESTIC AI",
            description: "AI-powered tool for recognizing sign language gestures and translating them to text.",
            year: "2025",
            icon: FaCode,
            image: "/achievements/GESTIC AI.png",
            link: "https://youtu.be/RhhVEGrfw40?si=oUz03HbNeFa2gYCi"
        },
        {
            title: "Peel and Petal",
            description: "Eco-friendly paper soap innovation reducing organic waste and promoting sustainable hygiene habits.",
            year: "2024",
            icon: HiStar,
            image: "/achievements/Peel and Petal.png",
            link: "https://youtu.be/KMP-H8RE7sE?si=3l-W3uMxEdFTiHPo"
        }
    ]
};

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
    const [activeVideo, setActiveVideo] = useState(null);

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
                        {achievements.organization.map((item, index) => (
                            <motion.div
                                key={index}
                                className="achievement-item project-card"
                                variants={itemTweens}
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
                                            <item.icon size={20} color="var(--accent)" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
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
                        {achievements.competition.map((item, index) => (
                            <motion.div
                                key={index}
                                className="achievement-item project-card"
                                variants={itemTweens}
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
                                            <item.icon size={20} color="var(--accent)" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
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
                        {achievements.projects.map((item, index) => (
                            <motion.div
                                key={index}
                                className="achievement-item project-card" // Added project-card class
                                variants={itemTweens}
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
                                                <item.icon size={20} color="var(--accent)" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
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
