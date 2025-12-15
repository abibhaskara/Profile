/* Abi Bhaskara copyright 2025 */
import { useState } from 'react';
import { HiEnvelope, HiPhone, HiMapPin } from 'react-icons/hi2';
import { FaLinkedin, FaGithub, FaInstagram } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Create mailto link with form data
        const subject = encodeURIComponent(`Portfolio Contact from ${formData.name}`);
        const body = encodeURIComponent(
            `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
        );

        window.location.href = `mailto:abibhaskaramulya@icloud.com?subject=${subject}&body=${body}`;

        alert('Opening your email client to send the message!');
        setFormData({ name: '', email: '', message: '' });
    };

    return (
        <div className="page">
            <div className="container">
                {/* Header */}
                <div className="page-header">
                    <motion.span
                        className="section-label"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                    >// Contact</motion.span>
                    <motion.h1
                        className="heading-lg"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                    >Get In Touch</motion.h1>
                </div>

                {/* Contact Grid */}
                <div className="contact-grid">
                    {/* Contact Info */}
                    <motion.div
                        className="contact-info"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                    >
                        <h2>Let's Work<br />Together</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: 1.7 }}>
                            I'm always open to discussing new projects, creative ideas,
                            or opportunities to be part of your vision.
                        </p>

                        <motion.a
                            href="mailto:abibhaskaramulya@icloud.com"
                            className="contact-link"
                            whileTap={{ scale: 0.95 }}
                            whileHover={{ scale: 1.02 }}
                        >
                            <HiEnvelope />
                            <span>abibhaskaramulya@icloud.com</span>
                        </motion.a>
                        <motion.a
                            href="tel:+1234567890"
                            className="contact-link"
                            whileTap={{ scale: 0.95 }}
                            whileHover={{ scale: 1.02 }}
                        >
                            <HiPhone />
                            <span>+62 896 1526 1006</span>
                        </motion.a>
                        <motion.div
                            className="contact-link"
                            whileTap={{ scale: 0.95 }}
                            whileHover={{ scale: 1.02 }}
                        >
                            <HiMapPin />
                            <span>Indonesia</span>
                        </motion.div>

                        <div className="social-links">
                            {[
                                { Icon: FaLinkedin, url: 'https://www.linkedin.com/in/abi-bhaskara-b62633397/' },
                                { Icon: FaGithub, url: 'https://github.com/abibhaskara' },
                                { Icon: FaInstagram, url: 'https://www.instagram.com/abibhaskara_/' }
                            ].map(({ Icon, url }, idx) => (
                                <motion.a
                                    key={idx}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="social-link"
                                    whileHover={{ scale: 1.1, color: "var(--accent)", transition: { duration: 0.2 } }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Icon />
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.form
                        className="card contact-form"
                        onSubmit={handleSubmit}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                    >
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Your name"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="your@email.com"
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="message">Message</label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Tell me about your project..."
                                required
                            />
                        </div>
                        <motion.button
                            type="submit"
                            className="btn-primary"
                            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Send Message
                        </motion.button>
                    </motion.form>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
