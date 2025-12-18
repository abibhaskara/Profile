/* Abi Bhaskara copyright 2025 */
import { FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { HiArrowRight } from 'react-icons/hi2';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import profileImage from '../assets/profile_optimized.jpg';

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.7, ease: "easeOut" } // Tween default
};



const ProfilePage = ({ isAppLoading = false }) => {
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 500], [0, 200]); // Moves background down slower than scroll
    const opacity = useTransform(scrollY, [0, 300], [1, 0]); // Fades out as user scrolls

    // Wait for loading screen to complete before starting animations
    const heroAnimateState = isAppLoading ? "hidden" : "visible";

    return (
        <div className="page">

            {/* Hero Section */}
            <section className="hero-section">
                {/* Background Image */}
                <motion.div
                    className="hero-bg"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={isAppLoading ? { opacity: 0, scale: 1.1 } : { opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    style={{ y, opacity: isAppLoading ? 0 : opacity }}
                >
                    <img
                        src={profileImage}
                        alt="Portrait"
                    />
                    <div className="hero-overlay"></div>
                </motion.div>

                <motion.div
                    className="container hero-content"
                    initial="hidden"
                    animate={heroAnimateState}
                    variants={{
                        hidden: { opacity: 0, transition: { duration: 0 } },
                        visible: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.2,
                                delayChildren: 0.3,
                                ease: "easeOut"
                            }
                        }
                    }}
                >
                    {/* Massive Name - Animate as single unit */}
                    <motion.div
                        className="hero-name-container"
                        variants={{
                            hidden: { opacity: 0, y: 40 },
                            visible: {
                                opacity: 1,
                                y: 0,
                                transition: {
                                    duration: 1,
                                    ease: [0.25, 0.1, 0.25, 1] // Smooth cubic bezier
                                }
                            }
                        }}
                    >
                        <h1 className="hero-name">ABI</h1>
                        <h1 className="hero-name hero-name-offset">BHASKARA</h1>
                    </motion.div>

                    <div className="hero-bottom">
                        {/* Social Links */}
                        <motion.div
                            className="hero-socials"
                            variants={{
                                hidden: { opacity: 0, x: -20 },
                                visible: {
                                    opacity: 1,
                                    x: 0,
                                    transition: { duration: 0.8, ease: "easeOut" }
                                }
                            }}
                        >
                            <motion.a
                                href="https://www.linkedin.com/in/abi-bhaskara-b62633397/"
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            ><FaLinkedin /> Linkedin</motion.a>
                            <motion.a
                                href="https://www.instagram.com/abibhaskara_/"
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            ><FaInstagram /> Instagram</motion.a>
                        </motion.div>

                        {/* Subtitle */}
                        <motion.div
                            className="hero-subtitle"
                            variants={{
                                hidden: { opacity: 0, x: 20 },
                                visible: {
                                    opacity: 1,
                                    x: 0,
                                    transition: { duration: 0.8, ease: "easeOut" }
                                }
                            }}
                        >
                            <span className="hero-label">// Tech Enthusiast</span>
                            <h2 className="hero-role">Student Researcher</h2>
                        </motion.div>
                    </div>
                </motion.div>
            </section>

            {/* Intro Section */}
            <section className="intro-section">
                <div className="container">
                    <motion.span
                        className="section-label"
                        {...fadeInUp}
                    >// Intro</motion.span>

                    <div className="intro-content">
                        <motion.p
                            className="intro-text"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        >
                            A high school student who loves <span style={{ color: "var(--accent)" }}>coding</span> and <span style={{ color: "var(--accent)" }}>experimenting with technology</span>. I am dedicated to <span style={{ color: "var(--accent)" }}>solving problems</span>, and continuously learning by <span style={{ color: "var(--accent)" }}>building functional digital products</span>.
                        </motion.p>

                        <motion.p
                            className="intro-desc"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                        >
                            Bringing your vision to life quickly and efficiently—whether it's branding, apps, or websites—I've got it covered, delivering smooth and effective solutions from start to finish.
                        </motion.p>

                        <Link to="/achievement#projects" style={{ textDecoration: 'none' }}>
                            <motion.button
                                className="btn-outline"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                                whileTap={{ scale: 0.95 }}
                            >
                                See my Work
                                <HiArrowRight />
                            </motion.button>
                        </Link>
                    </div>
                </div>
            </section>



            {/* Footer Removed - Now Global */}

        </div>
    );
};

export default ProfilePage;
