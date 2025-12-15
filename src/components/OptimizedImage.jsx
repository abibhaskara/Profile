/* Abi Bhaskara copyright 2025 */
import { useState, useRef, useEffect } from 'react';

/**
 * OptimizedImage - A lazy-loading image component with error handling
 * 
 * Features:
 * - Intersection Observer for lazy loading
 * - Loading placeholder
 * - Error state with fallback
 * - Smooth fade-in animation
 */
const OptimizedImage = ({
    src,
    alt,
    className = '',
    style = {},
    fallbackSrc = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%231a1a1a" width="100" height="100"/%3E%3Ctext x="50" y="55" text-anchor="middle" fill="%23666" font-size="12"%3ENo Image%3C/text%3E%3C/svg%3E',
    ...props
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const imgRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsInView(true);
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                rootMargin: '100px', // Start loading 100px before entering viewport
                threshold: 0.01
            }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => {
            if (imgRef.current) {
                observer.unobserve(imgRef.current);
            }
        };
    }, []);

    const handleLoad = () => {
        setIsLoaded(true);
    };

    const handleError = () => {
        setHasError(true);
        setIsLoaded(true);
    };

    return (
        <div
            ref={imgRef}
            className={`optimized-image-wrapper ${className}`}
            style={{
                position: 'relative',
                overflow: 'hidden',
                ...style
            }}
        >
            {/* Placeholder */}
            {!isLoaded && (
                <div
                    className="image-placeholder"
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(255, 255, 255, 0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <div
                        className="loading-pulse"
                        style={{
                            width: '30px',
                            height: '30px',
                            borderRadius: '50%',
                            background: 'rgba(255, 255, 255, 0.1)',
                            animation: 'pulse 1.5s ease-in-out infinite'
                        }}
                    />
                </div>
            )}

            {/* Actual Image */}
            {isInView && (
                <img
                    src={hasError ? fallbackSrc : src}
                    alt={alt}
                    loading="lazy"
                    decoding="async"
                    onLoad={handleLoad}
                    onError={handleError}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        opacity: isLoaded ? 1 : 0,
                        transition: 'opacity 0.3s ease-in-out'
                    }}
                    {...props}
                />
            )}
        </div>
    );
};

export default OptimizedImage;
