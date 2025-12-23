/* Abi Bhaskara copyright 2025 */
import { Suspense, lazy, useState, useEffect, useRef, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './index.css';
import './markdown.css';

// Components
import Background from './components/Background';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingScreen from './components/LoadingScreen';
import { LoadingProvider } from './context/LoadingContext';
import { LanguageProvider } from './context/LanguageContext';

// Pages - Eager (Critical path)
import ProfilePage from './pages/ProfilePage';

// Pages - Lazy (Non-critical, loaded on demand)
const AchievementPage = lazy(() => import('./pages/AchievementPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Loading component for Suspense fallback
const LoadingSpinner = () => (
  <div className="loading-container" role="status" aria-label="Loading">
    <div className="loading-circle" style={{ animation: 'spin 1s linear infinite' }} />
    <span className="loading-text">Loading...</span>
  </div>
);

// Inner app component (needs to be inside Router to use useLocation)
function AppContent({ audioRef, isPlaying, setIsPlaying, hasStarted, setHasStarted, theme, toggleTheme, toggleMusic, isAppLoading }) {
  const location = useLocation();
  const isAdminPage = location.pathname === '/admin';
  const wasPlayingRef = useRef(false);

  // Auto-pause on admin page, resume when leaving
  useEffect(() => {
    if (isAdminPage) {
      // Entering admin page - pause music and remember state
      if (isPlaying) {
        wasPlayingRef.current = true;
        audioRef.current?.pause();
      }
    } else {
      // Leaving admin page - resume if was playing before
      if (wasPlayingRef.current && audioRef.current) {
        audioRef.current.play().catch(() => { });
        wasPlayingRef.current = false;
      }
    }
  }, [isAdminPage, isPlaying, audioRef]);

  // Analytics tracking on route change
  useEffect(() => {
    // Don't track admin page
    if (isAdminPage) return;

    const trackPageView = async () => {
      try {
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: location.pathname })
        });
      } catch (e) {
        // Silently fail - analytics shouldn't break the app
      }
    };

    trackPageView();
  }, [location.pathname, isAdminPage]);

  return (
    <>
      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      {/* Audio element - hidden on admin page */}
      {!isAdminPage && (
        <audio
          ref={audioRef}
          src="/music.mp3"
          loop
          autoPlay
          onPlay={() => {
            setIsPlaying(true);
            setHasStarted(true);
          }}
          onPause={() => setIsPlaying(false)}
        />
      )}

      <Background />
      <ScrollToTop />

      <Navbar
        isPlaying={isPlaying && !isAdminPage}
        toggleMusic={toggleMusic}
        theme={theme}
        toggleTheme={toggleTheme}
        isAdminPage={isAdminPage}
      />

      <main id="main-content">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<ProfilePage isAppLoading={isAppLoading} />} />
            <Route path="/achievement" element={<AchievementPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
    </>
  );
}

function App() {
  // Loading State
  const [isAppLoading, setIsAppLoading] = useState(true);

  // Audio State
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  }, []);

  // Audio Logic
  useEffect(() => {
    if (hasStarted) return;
    const attemptPlay = async () => {
      if (audioRef.current && audioRef.current.paused) {
        try {
          audioRef.current.volume = 0.5;
          await audioRef.current.play();
        } catch (error) {
          console.log("Audio play blocked/failed:", error);
        }
      }
    };
    attemptPlay();

    const handleInteraction = () => {
      if (!hasStarted) attemptPlay();
    };

    window.addEventListener('pointerdown', handleInteraction, { capture: true });
    window.addEventListener('keydown', handleInteraction, { capture: true });
    return () => {
      window.removeEventListener('pointerdown', handleInteraction, { capture: true });
      window.removeEventListener('keydown', handleInteraction, { capture: true });
    };
  }, [hasStarted]);

  const toggleMusic = useCallback(() => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  }, [isPlaying]);

  return (
    <>
      <LoadingScreen onComplete={() => setIsAppLoading(false)} />

      {/* Content renders but is invisible during loading - allows preload */}
      <div style={{
        opacity: isAppLoading ? 0 : 1,
        transition: 'opacity 0.3s ease-out',
        visibility: isAppLoading ? 'hidden' : 'visible'
      }}>
        <LanguageProvider>
          <ErrorBoundary>
            <Router>
              <AppContent
                audioRef={audioRef}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                hasStarted={hasStarted}
                setHasStarted={setHasStarted}
                theme={theme}
                toggleTheme={toggleTheme}
                toggleMusic={toggleMusic}
                isAppLoading={isAppLoading}
              />
            </Router>
          </ErrorBoundary>
        </LanguageProvider>
      </div>
    </>
  );
}

export default App;

