/* Abi Bhaskara copyright 2025 */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Background from './Background';

const LoadingScreen = ({ onComplete }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Show loading for exactly 5 seconds to allow components to load
        const timer = setTimeout(() => {
            setIsVisible(false);
            onComplete?.();
        }, 5000);

        return () => clearTimeout(timer);
    }, [onComplete]);

    const styles = {
        container: {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'var(--bg-primary)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
        },
        name: {
            fontSize: 'clamp(2rem, 6vw, 4rem)',
            fontWeight: '300',
            color: 'var(--text-primary)',
            letterSpacing: '0.05em',
            position: 'relative',
            zIndex: 1
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    style={styles.container}
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                >
                    {/* Same background as website */}
                    <Background />

                    <motion.div
                        style={styles.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{
                            opacity: [0.4, 1, 0.4],
                            scale: [0.98, 1, 0.98],
                            y: 0
                        }}
                        transition={{
                            opacity: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
                            scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
                            y: { duration: 0.5, ease: 'easeOut' }
                        }}
                    >
                        Abi Bhaskara
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LoadingScreen;


