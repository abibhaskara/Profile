/* Abi Bhaskara copyright 2025 */
import { NavLink } from 'react-router-dom';
import { useState, useEffect, useRef, memo } from 'react';
import { motion } from 'framer-motion';
import {
  HiUser,
  HiTrophy,
  HiBookOpen,
  HiEnvelope,
  HiSun,
  HiMoon,
  HiMusicalNote // Import music icon
} from 'react-icons/hi2';

// Custom Medal Icon Component
const MedalIcon = () => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 384 512"
    height="18"
    width="18"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M97.12 362.63c-8.69-8.69-4.16-6.24-25.12-11.85-9.51-2.55-17.87-7.45-25.43-13.32L1.2 448.7c-4.39 10.77 3.81 22.47 15.43 22.03l52.69-2.01L105.56 507c8 8.44 22.04 5.81 26.43-4.96l52.05-127.62c-10.84 6.04-22.87 9.58-35.31 9.58-19.5 0-37.82-7.59-51.61-21.37zM382.8 448.7l-45.37-111.24c-7.56 5.88-15.92 10.77-25.43 13.32-21.07 5.64-16.45 3.18-25.12 11.85-13.79 13.78-32.12 21.37-51.62 21.37-12.44 0-24.47-3.55-35.31-9.58L252 502.04c4.39 10.77 18.44 13.4 26.43 4.96l36.25-38.28 52.69 2.01c11.62.44 19.82-11.27 15.43-22.03zM263 340c15.28-15.55 17.03-14.21 38.79-20.14 13.89-3.79 24.75-14.84 28.47-28.98 7.48-28.4 5.54-24.97 25.95-45.75 10.17-10.35 14.14-25.44 10.42-39.58-7.47-28.38-7.48-24.42 0-52.83 3.72-14.14-.25-29.23-10.42-39.58-20.41-20.78-18.47-17.36-25.95-45.75-3.72-14.14-14.58-25.19-28.47-28.98-27.88-7.61-24.52-5.62-44.95-26.41-10.17-10.35-25-14.4-38.89-10.61-27.87 7.6-23.98 7.61-51.9 0-13.89-3.79-28.72.25-38.89 10.61-20.41 20.78-17.05 18.8-44.94 26.41-13.89 3.79-24.75 14.84-28.47 28.98-7.47 28.39-5.54 24.97-25.95 45.75-10.17 10.35-14.15 25.44-10.42 39.58 7.47 28.36 7.48 24.4 0 52.82-3.72 14.14.25 29.23 10.42 39.59 20.41 20.78 18.47 17.35 25.95 45.75 3.72 14.14 14.58 25.19 28.47 28.98C104.6 325.96 106.27 325 121 340c13.23 13.47 33.84 15.88 49.74 5.82a39.676 39.676 0 0 1 42.53 0c15.89 10.06 36.5 7.65 49.73-5.82zM97.66 175.96c0-53.03 42.24-96.02 94.34-96.02s94.34 42.99 94.34 96.02-42.24 96.02-94.34 96.02-94.34-42.99-94.34-96.02z"></path>
  </svg>
);

const navItems = [
  { path: '/', label: 'Profile', icon: HiUser },
  { path: '/achievement', label: 'Achievement', icon: MedalIcon },
  { path: '/blog', label: 'Blog', icon: HiBookOpen },
  { path: '/contact', label: 'Contact', icon: HiEnvelope },
];

const Navbar = ({ isPlaying, toggleMusic, theme, toggleTheme }) => {
  // Theme State managed by Parent (App.jsx)

  // Music State managed by Parent (App.jsx)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // State for hover displacement
  const [hoveredPath, setHoveredPath] = useState(null);
  const [blurItem, setBlurItem] = useState(null); // Keep blur state for handleNavClick

  const handleNavClick = (path) => {
    setBlurItem(path);
    setTimeout(() => setBlurItem(null), 300);
  };

  const getHoverOffset = (path) => {
    if (!hoveredPath) return 0;
    const items = navItems.map(i => i.path);
    const hoveredIndex = items.indexOf(hoveredPath);
    const currentIndex = items.indexOf(path);

    // Broad Displacement Logic
    if (currentIndex < hoveredIndex) return -10; // All items to the left move left
    if (currentIndex > hoveredIndex) return 10;  // All items to the right move right
    return 0;
  };

  return (
    <motion.nav
      className="navbar"
      role="navigation"
      aria-label="Main navigation"
      layout
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      onMouseLeave={() => setHoveredPath(null)} // Reset when leaving navbar
    >
      {navItems.map((item) => {
        const offset = getHoverOffset(item.path);
        const isHovered = hoveredPath === item.path;

        return (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => handleNavClick(item.path)}
            onMouseEnter={() => setHoveredPath(item.path)}
            className={({ isActive }) =>
              isActive ? 'nav-item active' : 'nav-item'
            }
          >
            {({ isActive }) => (
              <>
                <motion.div
                  layout
                  style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center' }}
                  animate={{
                    filter: "blur(0px)", // Default state
                    x: offset,
                    scale: isHovered ? 1.1 : 1,
                    opacity: 1
                  }}
                  transition={{
                    layout: { type: "spring", stiffness: 300, damping: 30 },
                    filter: { type: "spring", stiffness: 300, damping: 30 }, // Sync blur with scale physics
                    scale: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                    x: { type: "spring", stiffness: 300, damping: 30 }
                  }}
                  whileTap={{ scale: 0.95, filter: "blur(2px)" }} // Blur only while pressed/shrunk
                >
                  <item.icon />
                  <motion.span
                    initial={false}
                    animate={{
                      width: isMobile ? (isActive ? "auto" : 0) : "auto",
                      opacity: isMobile ? (isActive ? 1 : 0) : 1,
                      marginLeft: isMobile ? (isActive ? 6 : 0) : 6
                    }}
                    transition={{
                      width: { type: "spring", stiffness: 300, damping: 30 },
                      marginLeft: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.2 }
                    }}
                    style={{ overflow: "hidden", whiteSpace: "nowrap" }}
                  >
                    {item.label}
                  </motion.span>
                </motion.div>
                {isActive && (
                  <motion.div
                    layoutId="activePill"
                    className="active-pill"
                    animate={{
                      x: offset,
                      scale: isHovered ? 1.1 : 1
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </>
            )}
          </NavLink>
        );
      })}

      <div className="nav-divider" style={{ width: '1px', height: '24px', background: 'var(--border)', margin: '0 8px' }}></div>

      <motion.button
        onClick={toggleTheme}
        className="nav-item"
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        aria-label="Toggle theme"
        whileHover={{ scale: 1.1, color: 'var(--text-primary)' }}
        whileTap={{ scale: 0.95, rotate: 15 }}
      >
        <motion.div
          key={theme}
          initial={{ rotate: -180, opacity: 0, scale: 0.5 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {theme === 'dark' ? <HiSun /> : <HiMoon />}
        </motion.div>
      </motion.button>

      <motion.button
        onClick={toggleMusic}
        className="nav-item"
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: isPlaying ? 'var(--accent)' : 'var(--text-secondary)', // Active color
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        aria-label="Toggle music"
        whileHover={{ scale: 1.1, color: 'var(--text-primary)' }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={isPlaying ? {
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0]
          } : {
            scale: 1,
            rotate: 0
          }}
          transition={isPlaying ? {
            duration: 1.5,
            repeat: Infinity,
            repeatType: "loop"
          } : {}}
        >
          <HiMusicalNote />
        </motion.div>
      </motion.button>
    </motion.nav>
  );
};

export default memo(Navbar);
