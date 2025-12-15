import { Component } from 'react';
import { motion } from 'framer-motion';
import { HiHome, HiArrowPath } from 'react-icons/hi2';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
        // Log error to console in development
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    render() {
        if (this.state.hasError) {
            const styles = {
                page: {
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '120px 20px 80px',
                    position: 'relative',
                    overflow: 'hidden',
                    background: 'var(--bg-primary)'
                },
                backgroundNumber: {
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: 'clamp(20rem, 50vw, 40rem)',
                    fontWeight: '900',
                    lineHeight: '1',
                    color: 'var(--text-primary)',
                    opacity: '0.03',
                    userSelect: 'none',
                    pointerEvents: 'none',
                    zIndex: 0
                },
                content: {
                    textAlign: 'center',
                    maxWidth: '600px',
                    position: 'relative',
                    zIndex: 1
                },
                title: {
                    fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                    fontWeight: '700',
                    color: 'var(--text-primary)',
                    marginBottom: '16px'
                },
                description: {
                    fontSize: '16px',
                    color: 'var(--text-secondary)',
                    lineHeight: '1.6',
                    marginBottom: '40px',
                    maxWidth: '400px',
                    marginLeft: 'auto',
                    marginRight: 'auto'
                },
                actions: {
                    display: 'flex',
                    gap: '16px',
                    justifyContent: 'center',
                    flexWrap: 'wrap'
                },
                btnOutline: {
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '14px 28px',
                    background: 'transparent',
                    border: '1px solid var(--border)',
                    borderRadius: '9999px',
                    color: 'var(--text-primary)',
                    fontSize: '15px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                },
                btnPrimary: {
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '14px 28px',
                    background: 'var(--accent)',
                    border: 'none',
                    borderRadius: '9999px',
                    color: 'white',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                }
            };

            return (
                <div style={styles.page}>
                    {/* Background 500 */}
                    <motion.div
                        style={styles.backgroundNumber}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.03 }}
                        transition={{ duration: 1.5 }}
                    >
                        500
                    </motion.div>

                    <motion.div
                        style={styles.content}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <motion.h1
                            style={styles.title}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            Something went wrong
                        </motion.h1>

                        <motion.p
                            style={styles.description}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            We're sorry, but something unexpected happened. Please try refreshing the page.
                        </motion.p>

                        <motion.div
                            style={styles.actions}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <motion.button
                                onClick={this.handleRetry}
                                style={styles.btnOutline}
                                whileHover={{ background: 'rgba(255,255,255,0.05)', scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <HiArrowPath /> Try Again
                            </motion.button>
                            <motion.button
                                onClick={() => window.location.href = '/'}
                                style={styles.btnPrimary}
                                whileHover={{ transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(239, 68, 68, 0.3)' }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <HiHome /> Go Home
                            </motion.button>
                        </motion.div>
                    </motion.div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
