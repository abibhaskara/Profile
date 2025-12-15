/* Abi Bhaskara copyright 2025 */
import { motion } from 'framer-motion';

const Background = () => {
    return (
        <div className="global-background">
            <motion.div
                className="bg-blob blob-1"
                animate={{
                    x: [0, 400, 0],
                    y: [0, -300, 0],
                    scale: [1, 1.4, 1],
                    rotate: [0, 180, 360],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
            <motion.div
                className="bg-blob blob-2"
                animate={{
                    x: [0, -400, 0],
                    y: [0, 300, 0],
                    scale: [1.4, 1, 1.4],
                    rotate: [360, 180, 0],
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
        </div>
    );
};

export default Background;
