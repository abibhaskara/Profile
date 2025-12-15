/* Abi Bhaskara copyright 2025 */
import { motion } from 'framer-motion';

const Footer = () => {
    return (
        <section className="footer-section">
            <div className="container">
                <motion.div
                    className="footer-content"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <div className="footer-left">
                        <h2>Let's work <br /> together.</h2>
                        <motion.a
                            href="mailto:abibhaskaramulya@icloud.com"
                            className="footer-email"
                            whileHover={{ x: 10, color: "var(--accent)", transition: { duration: 0.2 } }}
                            whileTap={{ scale: 0.95 }}
                        >
                            abibhaskaramulya@icloud.com
                        </motion.a>
                    </div>

                    <div className="footer-right">
                        <span>© 2025 Abi Bhaskara</span>
                        <span>Privacy Policy</span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Footer;
