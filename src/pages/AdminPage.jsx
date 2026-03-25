/* Abi Bhaskara copyright 2025 */
import { useState, useEffect, useMemo, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { HiPlus, HiPencil, HiTrash, HiCheck, HiXMark, HiCloudArrowUp, HiPhoto, HiVideoCamera, HiChartBar, HiDocumentText, HiCog, HiEye, HiCalendar, HiTrophy } from 'react-icons/hi2';

// API URLs
const API_BASE = '/api/posts';
const SETTINGS_API = '/api/settings';
const UPLOAD_API = '/api/upload';
const ANALYTICS_API = '/api/analytics';
const ACHIEVEMENTS_API = '/api/achievements';

const AdminPage = () => {
    const [posts, setPosts] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        description: '',
        content: '',
        image: '',
        tags: '',
        // Per-post media settings
        mediaType: null,
        youtubeUrl: '',
        carouselImages: '[]'
    });
    const [originalSlug, setOriginalSlug] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    // Blog Header Settings State
    const [headerSettings, setHeaderSettings] = useState({
        mediaType: 'youtube',
        youtubeUrl: '',
        carouselImages: []
    });
    const [isUploadingCarousel, setIsUploadingCarousel] = useState(false);
    const [isSavingSettings, setIsSavingSettings] = useState(false);

    // Analytics State
    const [analytics, setAnalytics] = useState({
        totalViews: 0,
        todayViews: 0,
        totalPosts: 0,
        topPosts: []
    });

    // Achievements State
    const [achievements, setAchievements] = useState([]);
    const [isAchievementEditing, setIsAchievementEditing] = useState(false);
    const [achievementFormData, setAchievementFormData] = useState({
        title: '',
        description: '',
        year: '',
        category: 'competition',
        icon: 'FaMedal',
        image: '',
        link: '',
        order: 0
    });

    // Mobile Tab State
    const [activeTab, setActiveTab] = useState('dashboard');

    // Fetch posts
    const fetchPosts = async () => {
        try {
            const res = await fetch(API_BASE);
            if (res.ok) {
                const data = await res.json();
                setPosts(data);
            }
        } catch (err) {
            console.error("Failed to fetch posts:", err);
        }
    };

    // Fetch analytics
    const fetchAnalytics = async () => {
        try {
            const res = await fetch(`${ANALYTICS_API}/summary`);
            if (res.ok) {
                const data = await res.json();
                setAnalytics(data);
            }
        } catch (err) {
            console.error("Failed to fetch analytics:", err);
        }
    };

    useEffect(() => {
        fetchPosts();
        fetchHeaderSettings();
        fetchAnalytics();
        fetchAchievements();
    }, []);

    // Fetch achievements
    const fetchAchievements = async () => {
        try {
            const res = await fetch(ACHIEVEMENTS_API);
            if (res.ok) {
                const data = await res.json();
                setAchievements(data);
            }
        } catch (err) {
            console.error("Failed to fetch achievements:", err);
        }
    };

    // Fetch blog header settings
    const fetchHeaderSettings = async () => {
        try {
            const res = await fetch(`${SETTINGS_API}/blogHeader`);
            if (res.ok) {
                const data = await res.json();
                if (data.value) {
                    setHeaderSettings(data.value);
                }
            }
        } catch (err) {
            console.error("Failed to fetch header settings:", err);
        }
    };

    // Save blog header settings
    const saveHeaderSettings = async () => {
        setIsSavingSettings(true);
        try {
            const res = await fetch(`${SETTINGS_API}/blogHeader`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ value: headerSettings })
            });
            if (res.ok) {
                alert('Header settings saved!');
            } else {
                const errorText = await res.text();
                console.error('Save settings failed:', res.status, errorText);
                alert(`Failed to save settings: ${res.status} - ${errorText}`);
            }
        } catch (err) {
            console.error('Save settings error:', err);
            alert(`Error saving settings: ${err.message}`);
        }
        setIsSavingSettings(false);
    };

    const resetForm = () => {
        setFormData({
            title: '',
            slug: '',
            description: '',
            content: '',
            image: '',
            tags: '',
            mediaType: null,
            youtubeUrl: '',
            carouselImages: '[]'
        });
        setOriginalSlug(null);
        setIsEditing(false);
    };

    const handleEdit = (post) => {
        setFormData({
            ...post,
            tags: typeof post.tags === 'string' ? JSON.parse(post.tags).join(', ') : post.tags
        });
        setOriginalSlug(post.slug);
        setIsEditing(true);
    };

    // Achievement Handlers
    const resetAchievementForm = () => {
        setAchievementFormData({
            title: '',
            description: '',
            year: '',
            category: 'competition',
            icon: 'FaMedal',
            image: '',
            link: '',
            order: 0
        });
        setIsAchievementEditing(false);
    };

    const handleAchievementEdit = (achievement) => {
        setAchievementFormData(achievement);
        setIsAchievementEditing(true);
    };

    const handleAchievementDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this achievement?')) return;
        await fetch(`${ACHIEVEMENTS_API}/${id}`, { method: 'DELETE' });
        fetchAchievements();
    };

    const handleAchievementSubmit = async (e) => {
        e.preventDefault();
        const method = achievementFormData.id ? 'PUT' : 'POST';
        const url = achievementFormData.id ? `${ACHIEVEMENTS_API}/${achievementFormData.id}` : ACHIEVEMENTS_API;

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(achievementFormData)
            });
            if (res.ok) {
                alert('Achievement saved!');
                resetAchievementForm();
                fetchAchievements();
            } else {
                alert('Failed to save achievement');
            }
        } catch (err) {
            console.error(err);
            alert('Error saving achievement');
        }
    };

    const handleDelete = async (slug) => {
        if (!confirm('Are you sure you want to delete this post?')) return;
        await fetch(`${API_BASE}/${slug}`, { method: 'DELETE' });
        fetchPosts();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const tagsArray = formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [];
        const payload = {
            ...formData,
            tags: JSON.stringify(tagsArray)
        };

        const method = formData.id ? 'PUT' : 'POST';
        const url = formData.id
            ? `${API_BASE}/${originalSlug || formData.slug}`
            : API_BASE;

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert('Post saved successfully!');
                resetForm();
                fetchPosts();
            } else {
                alert('Failed to save post: ' + res.statusText);
            }
        } catch (error) {
            console.error(error);
            alert('Error saving post');
        }
    };

    // Image upload handler
    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image size must be less than 5MB');
            return;
        }

        setIsUploading(true);

        try {
            // Convert to base64
            const reader = new FileReader();
            reader.onload = async () => {
                const base64 = reader.result;

                const res = await fetch(UPLOAD_API, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ image: base64 })
                });

                if (res.ok) {
                    const data = await res.json();
                    setFormData(prev => ({ ...prev, image: data.url }));
                } else {
                    const error = await res.json();
                    alert('Upload failed: ' + (error.message || 'Unknown error'));
                }
                setIsUploading(false);
            };
            reader.onerror = () => {
                alert('Failed to read file');
                setIsUploading(false);
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error('Upload error:', error);
            alert('Upload failed');
            setIsUploading(false);
        }
    };

    // Carousel image upload handler
    const handleCarouselImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('Image size must be less than 5MB');
            return;
        }

        if (headerSettings.carouselImages.length >= 5) {
            alert('Maximum 5 images allowed');
            return;
        }

        setIsUploadingCarousel(true);

        try {
            const reader = new FileReader();
            reader.onload = async () => {
                const base64 = reader.result;

                const res = await fetch(UPLOAD_API, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ image: base64 })
                });

                if (res.ok) {
                    const data = await res.json();
                    setHeaderSettings(prev => ({
                        ...prev,
                        carouselImages: [...prev.carouselImages, data.url]
                    }));
                } else {
                    alert('Upload failed');
                }
                setIsUploadingCarousel(false);
            };
            reader.onerror = () => {
                alert('Failed to read file');
                setIsUploadingCarousel(false);
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error('Upload error:', error);
            setIsUploadingCarousel(false);
        }
    };

    const removeCarouselImage = (index) => {
        setHeaderSettings(prev => ({
            ...prev,
            carouselImages: prev.carouselImages.filter((_, i) => i !== index)
        }));
    };

    // Styles
    const styles = {
        container: {
            paddingTop: '120px',
            paddingBottom: '120px',
            minHeight: '100vh'
        },
        header: {
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: '700',
            marginBottom: '48px',
            color: 'var(--text-primary)'
        },
        gridLarge: {
            display: 'flex',
            flexDirection: 'column',
            gap: '32px'
        },
        // Tab Navigation (Horizontal Top Bar)
        tabNav: {
            display: 'flex',
            gap: '12px',
            marginBottom: '48px',
            background: 'rgba(255, 255, 255, 0.03)',
            padding: '8px',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            maxWidth: 'fit-content'
        },
        tabButton: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '12px 24px',
            background: 'transparent',
            border: 'none',
            borderRadius: '12px',
            color: 'var(--text-secondary)',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        },
        tabActive: {
            background: '#ff4d4d', // Vibrant red as in the image
            color: 'white',
            boxShadow: '0 4px 15px rgba(255, 77, 77, 0.3)'
        },
        // Stats Grid
        statsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            marginBottom: '32px'
        },
        statCard: {
            background: 'var(--glass-surface)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '20px',
            textAlign: 'center'
        },
        statIcon: {
            color: 'var(--accent)',
            marginBottom: '8px'
        },
        statValue: {
            fontSize: '28px',
            fontWeight: '700',
            color: 'var(--text-primary)'
        },
        statLabel: {
            fontSize: '13px',
            color: 'var(--text-secondary)',
            marginTop: '4px'
        },
        // Top Posts Section
        topPostsSection: {
            background: 'var(--glass-surface)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '32px'
        },
        topPostsList: {
            marginTop: '16px'
        },
        topPostItem: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 0',
            borderBottom: '1px solid var(--border)'
        },
        topPostRank: {
            fontSize: '14px',
            fontWeight: '700',
            color: 'var(--accent)',
            minWidth: '30px'
        },
        topPostTitle: {
            flex: 1,
            fontSize: '14px',
            color: 'var(--text-primary)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
        },
        topPostViews: {
            fontSize: '13px',
            color: 'var(--text-secondary)',
            fontWeight: '500'
        },
        sidebar: {
            // Now used as the list container
            width: '100%'
        },
        sectionHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px'
        },
        sidebarHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px'
        },
        sectionTitle: {
            fontSize: '18px',
            fontWeight: '600',
            color: 'var(--text-primary)'
        },
        addButton: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '36px',
            background: 'var(--accent)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            cursor: 'pointer',
            transition: 'transform 0.2s, opacity 0.2s'
        },
        mediaTypeButton: {
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            border: '1px solid var(--border)',
            borderRadius: '9999px',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer'
        },
        postCard: {
            padding: '16px',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border)',
            borderLeft: '4px solid transparent',
            borderRadius: '16px',
            marginBottom: '12px',
            transition: 'all 0.2s ease-in-out'
        },
        postTitle: {
            fontWeight: '600',
            fontSize: '15px',
            color: 'var(--text-primary)',
            marginBottom: '4px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
        },
        postSlug: {
            fontSize: '13px',
            color: 'var(--text-muted)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
        },
        buttonGroup: {
            display: 'flex',
            gap: '8px',
            marginTop: '12px'
        },
        editButton: {
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '8px 12px',
            background: 'rgba(59, 130, 246, 0.15)',
            color: '#60a5fa',
            border: 'none',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background 0.2s'
        },
        deleteButton: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px 12px',
            background: 'rgba(239, 68, 68, 0.15)',
            color: '#f87171',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'background 0.2s'
        },
        form: {
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
        },
        formRow: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px'
        },
        formGroup: {
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
        },
        label: {
            fontSize: '13px',
            fontWeight: '500',
            color: 'var(--text-secondary)'
        },
        input: {
            width: '100%',
            padding: '12px 16px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            color: 'var(--text-primary)',
            fontSize: '14px',
            fontFamily: 'inherit',
            outline: 'none',
            transition: 'border-color 0.2s, background 0.2s'
        },
        textarea: {
            width: '100%',
            padding: '12px 16px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            color: 'var(--text-primary)',
            fontSize: '14px',
            fontFamily: 'inherit',
            resize: 'vertical',
            outline: 'none',
            transition: 'border-color 0.2s'
        },
        editorGrid: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            minHeight: '600px'
        },
        editorColumn: {
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
        },
        codeTextarea: {
            flex: 1,
            width: '100%',
            padding: '16px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            color: 'var(--text-primary)',
            fontSize: '13px',
            fontFamily: 'monospace',
            resize: 'none',
            outline: 'none',
            lineHeight: '1.6'
        },
        previewBox: {
            flex: 1,
            padding: '16px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            overflow: 'auto'
        },
        formActions: {
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            paddingTop: '16px',
            borderTop: '1px solid var(--border)'
        },
        cancelButton: {
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '12px 24px',
            background: 'transparent',
            border: '1px solid var(--border)',
            borderRadius: '9999px',
            color: 'var(--text-secondary)',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background 0.2s, color 0.2s'
        },
        submitButton: {
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '12px 24px',
            background: 'var(--accent)',
            border: 'none',
            borderRadius: '9999px',
            color: 'white',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'transform 0.2s, box-shadow 0.2s'
        },
        emptyState: {
            textAlign: 'center',
            padding: '32px',
            color: 'var(--text-muted)',
            fontSize: '14px'
        }
    };

    // Check if desktop (for responsive grid)
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="container" style={styles.container}>
            <motion.h1
                style={styles.header}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                📊 Admin Dashboard
            </motion.h1>

            {/* Tab Navigation (Unified for both Mobile & Desktop) */}
            <div style={styles.tabNav}>
                <button
                    style={{ ...styles.tabButton, ...(activeTab === 'dashboard' ? styles.tabActive : {}) }}
                    onClick={() => setActiveTab('dashboard')}
                >
                    <HiChartBar size={16} /> Stats
                </button>
                <button
                    style={{ ...styles.tabButton, ...(activeTab === 'posts' ? styles.tabActive : {}) }}
                    onClick={() => setActiveTab('posts')}
                >
                    <HiDocumentText size={16} /> Posts
                </button>
                <button
                    style={{ ...styles.tabButton, ...(activeTab === 'settings' ? styles.tabActive : {}) }}
                    onClick={() => setActiveTab('settings')}
                >
                    <HiCog size={16} /> Settings
                </button>
                <button
                    style={{ ...styles.tabButton, ...(activeTab === 'achievements' ? styles.tabActive : {}) }}
                    onClick={() => setActiveTab('achievements')}
                >
                    <HiTrophy size={16} /> Achievements
                </button>
            </div>

            {/* Dashboard Content (Stats & Popular Posts) */}
            {activeTab === 'dashboard' && (
                <>
                    <motion.div
                        style={styles.statsGrid}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <div style={styles.statCard}>
                        <div style={styles.statIcon}><HiEye size={24} /></div>
                        <div style={styles.statValue}>{analytics.totalViews}</div>
                        <div style={styles.statLabel}>Total Views</div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={styles.statIcon}><HiCalendar size={24} /></div>
                        <div style={styles.statValue}>{analytics.todayViews}</div>
                        <div style={styles.statLabel}>Today</div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={styles.statIcon}><HiDocumentText size={24} /></div>
                        <div style={styles.statValue}>{analytics.totalPosts}</div>
                        <div style={styles.statLabel}>Posts</div>
                    </div>
                    </motion.div>
                </>
            )}

            {/* Dashboard Popular Posts */}
            {activeTab === 'dashboard' && analytics.topPosts.length > 0 && (
                <motion.div
                    style={styles.topPostsSection}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <h2 style={styles.sectionTitle}><HiTrophy style={{ color: 'gold' }} /> Top 5 Popular Posts</h2>
                    <div style={styles.topPostsList}>
                        {analytics.topPosts.map((post, index) => (
                            <div key={post.id} style={styles.topPostItem}>
                                <span style={styles.topPostRank}>#{index + 1}</span>
                                <span style={styles.topPostTitle}>{post.title}</span>
                                <span style={styles.topPostViews}>{post.viewCount || 0} views</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            <div style={isDesktop ? styles.gridLarge : styles.grid}>
                {/* Posts Management Section */}
                {activeTab === 'posts' && (
                    <motion.div
                        style={isDesktop ? styles.sidebar : {}}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <div style={styles.sectionHeader}>
                            <h2 style={styles.sectionTitle}>Posts ({posts.length})</h2>
                            <motion.button
                                style={styles.addButton}
                                onClick={resetForm}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                title="Create new post"
                            >
                                <HiPlus size={18} />
                            </motion.button>
                        </div>

                        <div>
                            {posts.length === 0 ? (
                                <div style={styles.emptyState}>
                                    No posts yet. Create your first post!
                                </div>
                            ) : (
                                posts.map(post => (
                                    <motion.div
                                        key={post.id}
                                        style={styles.postCard}
                                        whileHover={{ borderColor: 'var(--accent)', background: 'rgba(255,255,255,0.05)' }}
                                    >
                                        <div style={styles.postTitle}>{post.title}</div>
                                        <div style={styles.postSlug}>/{post.slug}</div>
                                        <div style={styles.buttonGroup}>
                                            <motion.button
                                                style={styles.editButton}
                                                onClick={() => handleEdit(post)}
                                                whileHover={{ background: 'rgba(59, 130, 246, 0.25)' }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <HiPencil size={14} /> Edit
                                            </motion.button>
                                            <motion.button
                                                style={styles.deleteButton}
                                                onClick={() => handleDelete(post.slug)}
                                                whileHover={{ background: 'rgba(239, 68, 68, 0.25)' }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <HiTrash size={14} />
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}

                {/* Posts Editor Form */}
                {activeTab === 'posts' && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <h2 style={{ ...styles.sectionTitle, marginBottom: '24px' }}>
                            {formData.id ? '✏️ Edit Post' : '✨ Create New Post'}
                        </h2>

                        <form onSubmit={handleSubmit} style={styles.form}>
                            <div style={styles.formRow}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Title *</label>
                                    <input
                                        type="text"
                                        style={styles.input}
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="Enter post title"
                                        required
                                    />
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Slug *</label>
                                    <input
                                        type="text"
                                        style={styles.input}
                                        value={formData.slug}
                                        onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                        placeholder="post-url-slug"
                                        required
                                    />
                                </div>
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Description</label>
                                <textarea
                                    style={{ ...styles.textarea, minHeight: '80px' }}
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Brief description of the post"
                                    rows={2}
                                />
                            </div>

                            <div style={styles.formRow}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Image</label>
                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                        <input
                                            type="text"
                                            style={{ ...styles.input, flex: 1 }}
                                            value={formData.image}
                                            onChange={e => setFormData({ ...formData, image: e.target.value })}
                                            placeholder="URL or upload image"
                                        />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            style={{ display: 'none' }}
                                            id="image-upload"
                                        />
                                        <motion.label
                                            htmlFor="image-upload"
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                padding: '12px 16px',
                                                background: isUploading ? 'rgba(255,255,255,0.05)' : 'var(--accent)',
                                                color: 'white',
                                                borderRadius: '12px',
                                                fontSize: '14px',
                                                fontWeight: '500',
                                                cursor: isUploading ? 'wait' : 'pointer',
                                                whiteSpace: 'nowrap'
                                            }}
                                            whileHover={!isUploading ? { scale: 1.02 } : {}}
                                            whileTap={!isUploading ? { scale: 0.98 } : {}}
                                        >
                                            <HiCloudArrowUp size={18} />
                                            {isUploading ? 'Uploading...' : 'Upload'}
                                        </motion.label>
                                    </div>
                                    {formData.image && (
                                        <div style={{ marginTop: '12px' }}>
                                            <img
                                                src={formData.image}
                                                alt="Preview"
                                                style={{
                                                    maxWidth: '200px',
                                                    maxHeight: '120px',
                                                    borderRadius: '8px',
                                                    border: '1px solid var(--border)',
                                                    objectFit: 'cover'
                                                }}
                                                onError={(e) => e.target.style.display = 'none'}
                                            />
                                        </div>
                                    )}
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Tags (comma separated)</label>
                                    <input
                                        type="text"
                                        style={styles.input}
                                        value={formData.tags}
                                        onChange={e => setFormData({ ...formData, tags: e.target.value })}
                                        placeholder="tech, coding, react"
                                    />
                                </div>

                                {/* Per-Post Media Editor */}
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Post Media (Optional)</label>
                                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                                        <motion.button
                                            type="button"
                                            style={{
                                                ...styles.mediaTypeButton,
                                                background: formData.mediaType === 'youtube' ? 'var(--accent)' : 'none',
                                                color: formData.mediaType === 'youtube' ? 'white' : 'var(--text-secondary)'
                                            }}
                                            onClick={() => setFormData({ ...formData, mediaType: formData.mediaType === 'youtube' ? null : 'youtube' })}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <HiVideoCamera size={16} /> YouTube
                                        </motion.button>
                                        <motion.button
                                            type="button"
                                            style={{
                                                ...styles.mediaTypeButton,
                                                background: formData.mediaType === 'carousel' ? 'var(--accent)' : 'none',
                                                color: formData.mediaType === 'carousel' ? 'white' : 'var(--text-secondary)'
                                            }}
                                            onClick={() => setFormData({ ...formData, mediaType: formData.mediaType === 'carousel' ? null : 'carousel' })}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <HiPhoto size={16} /> Carousel
                                        </motion.button>
                                    </div>
                                    {formData.mediaType === 'youtube' && (
                                        <input
                                            type="text"
                                            style={styles.input}
                                            value={formData.youtubeUrl}
                                            onChange={e => setFormData({ ...formData, youtubeUrl: e.target.value })}
                                            placeholder="https://youtu.be/... or youtube.com/watch?v=..."
                                        />
                                    )}
                                    {formData.mediaType === 'carousel' && (
                                        <input
                                            type="text"
                                            style={styles.input}
                                            value={formData.carouselImages}
                                            onChange={e => setFormData({ ...formData, carouselImages: e.target.value })}
                                            placeholder='["url1","url2","url3"] - JSON array of image URLs'
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Split View Editor */}
                            <div style={isDesktop ? styles.editorGrid : { display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={styles.editorColumn}>
                                    <label style={styles.label}>Markdown Content</label>
                                    <textarea
                                        style={{ ...styles.codeTextarea, minHeight: isDesktop ? 'auto' : '300px' }}
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        placeholder="# Write your content here...

Use **bold** or *italic* text.

- List item 1
- List item 2

> Quote text

```code block```"
                                    />
                                </div>
                                <div style={styles.editorColumn}>
                                    <label style={styles.label}>Live Preview</label>
                                    <div style={styles.previewBox} className="markdown-body">
                                        {formData.content ? (
                                            <ReactMarkdown>{formData.content}</ReactMarkdown>
                                        ) : (
                                            <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                                                Preview will appear here...
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div style={styles.formActions}>
                                <motion.button
                                    type="button"
                                    style={styles.cancelButton}
                                    onClick={resetForm}
                                    whileHover={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)' }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <HiXMark size={16} /> Cancel
                                </motion.button>
                                <motion.button
                                    type="submit"
                                    style={styles.submitButton}
                                    whileHover={{ transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(239, 68, 68, 0.3)' }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <HiCheck size={16} /> {formData.id ? 'Update Post' : 'Publish Post'}
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                )}

                {/* Achievements Management Section */}
                {activeTab === 'achievements' && (
                    <div style={{ ... (isDesktop ? styles.gridLarge : styles.grid), marginTop: '0' }}>
                        <motion.div
                            style={isDesktop ? styles.sidebar : {}}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <div style={styles.sectionHeader}>
                                <h2 style={styles.sectionTitle}>Achievements ({achievements.length})</h2>
                                <motion.button
                                    type="button"
                                    style={styles.addButton}
                                    onClick={resetAchievementForm}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    title="Add new achievement"
                                >
                                    <HiPlus size={18} />
                                </motion.button>
                            </div>

                            <div style={{ maxHeight: isDesktop ? '600px' : 'auto', overflowY: isDesktop ? 'auto' : 'visible', paddingRight: '8px' }}>
                                {achievements.length === 0 ? (
                                    <div style={styles.emptyState}>
                                        No achievements yet. Add your first achievement!
                                    </div>
                                ) : (
                                    achievements.sort((a,b) => (a.order || 0) - (b.order || 0)).map(achievement => {
                                        const categoryColor = 
                                            achievement.category === 'competition' ? '#60a5fa' : 
                                            achievement.category === 'organization' ? '#34d399' : 
                                            achievement.category === 'projects' ? '#a78bfa' : 'var(--accent)';

                                        return (
                                            <motion.div
                                                key={achievement.id}
                                                style={{ 
                                                    ...styles.postCard, 
                                                    borderColor: achievementFormData.id === achievement.id ? 'var(--accent)' : 'var(--border)',
                                                    borderLeftColor: categoryColor,
                                                    background: achievementFormData.id === achievement.id ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)'
                                                }}
                                                whileHover={{ borderColor: 'var(--accent)', background: 'rgba(255,255,255,0.05)' }}
                                            >
                                                <div style={styles.postTitle}>{achievement.title}</div>
                                                <div style={styles.postSlug}>
                                                    <span style={{ color: categoryColor, fontWeight: '600', textTransform: 'capitalize' }}>{achievement.category}</span>
                                                    {' | '}
                                                    <span style={{ color: 'var(--text-muted)' }}>{achievement.year}</span>
                                                </div>
                                                <div style={styles.buttonGroup}>
                                                <motion.button
                                                    type="button"
                                                    style={styles.editButton}
                                                    onClick={() => handleAchievementEdit(achievement)}
                                                    whileHover={{ background: 'rgba(59, 130, 246, 0.25)' }}
                                                    whileTap={{ scale: 0.98 }}
                                                >
                                                    <HiPencil size={14} /> Edit
                                                </motion.button>
                                                <motion.button
                                                    type="button"
                                                    style={styles.deleteButton}
                                                    onClick={() => handleAchievementDelete(achievement.id)}
                                                    whileHover={{ background: 'rgba(239, 68, 68, 0.25)' }}
                                                    whileTap={{ scale: 0.98 }}
                                                >
                                                    <HiTrash size={14} />
                                                </motion.button>
                                            </div>
                                        </motion.div>
                                    );
                                })
                            )}
                            </div>
                        </motion.div>

                        {/* Achievement Editor Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            style={isDesktop ? { flex: 1 } : {}}
                        >
                            <h2 style={{ ...styles.sectionTitle, marginBottom: '24px' }}>
                                {achievementFormData.id ? '✏️ Edit Achievement' : '✨ Add New Achievement'}
                            </h2>

                            <form onSubmit={handleAchievementSubmit} style={{ ...styles.form, padding: '32px', background: 'var(--glass-surface)', borderRadius: '24px', border: '1px solid var(--border)' }}>
                                <div style={{ marginBottom: '16px' }}>
                                    <h2 style={{ ...styles.sectionTitle, fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {achievementFormData.id ? <HiPencil size={20} /> : <HiPlus size={20} />}
                                        {achievementFormData.id ? 'Edit Achievement' : 'Add New Achievement'}
                                    </h2>
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Title *</label>
                                    <input
                                        type="text"
                                        style={styles.input}
                                        value={achievementFormData.title}
                                        onChange={e => setAchievementFormData({ ...achievementFormData, title: e.target.value })}
                                        placeholder="Achievement title"
                                        required
                                    />
                                </div>

                                <div style={styles.formRow}>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Category *</label>
                                        <select
                                            style={styles.input}
                                            value={achievementFormData.category}
                                            onChange={e => setAchievementFormData({ ...achievementFormData, category: e.target.value })}
                                            required
                                        >
                                            <option value="competition">Competition</option>
                                            <option value="organization">Organization</option>
                                            <option value="projects">Projects</option>
                                        </select>
                                    </div>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Year/Period *</label>
                                        <input
                                            type="text"
                                            style={styles.input}
                                            value={achievementFormData.year}
                                            onChange={e => setAchievementFormData({ ...achievementFormData, year: e.target.value })}
                                            placeholder="e.g. 2025"
                                            required
                                        />
                                    </div>
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Description *</label>
                                    <textarea
                                        style={{ ...styles.textarea, minHeight: '120px' }}
                                        value={achievementFormData.description}
                                        onChange={e => setAchievementFormData({ ...achievementFormData, description: e.target.value })}
                                        placeholder="Detailed description of your achievement..."
                                        required
                                    />
                                </div>

                                <div style={styles.formRow}>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Icon Component</label>
                                        <select
                                            style={styles.input}
                                            value={achievementFormData.icon}
                                            onChange={e => setAchievementFormData({ ...achievementFormData, icon: e.target.value })}
                                        >
                                            <option value="HiTrophy">Trophy (HiTrophy)</option>
                                            <option value="FaMedal">Medal (FaMedal)</option>
                                            <option value="FaAward">Award (FaAward)</option>
                                            <option value="HiStar">Star (HiStar)</option>
                                            <option value="HiAcademicCap">Cap (HiAcademicCap)</option>
                                            <option value="FaCode">Code (FaCode)</option>
                                            <option value="FaUsers">Users (FaUsers)</option>
                                        </select>
                                    </div>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Order (Lower = First)</label>
                                        <input
                                            type="number"
                                            style={styles.input}
                                            value={achievementFormData.order}
                                            onChange={e => setAchievementFormData({ ...achievementFormData, order: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Image URL</label>
                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', flexWrap: isDesktop ? 'nowrap' : 'wrap' }}>
                                        <div style={{ flex: 1, minWidth: '200px' }}>
                                            <input
                                                type="text"
                                                style={styles.input}
                                                value={achievementFormData.image}
                                                onChange={e => setAchievementFormData({ ...achievementFormData, image: e.target.value })}
                                                placeholder="/achievements/image.png"
                                            />
                                            {achievementFormData.image && (
                                                <div style={{ marginTop: '12px' }}>
                                                    <img
                                                        src={achievementFormData.image}
                                                        alt="Preview"
                                                        style={{
                                                            width: '100%',
                                                            maxHeight: '150px',
                                                            borderRadius: '12px',
                                                            border: '1px solid var(--border)',
                                                            objectFit: 'cover'
                                                        }}
                                                        onError={(e) => e.target.style.display = 'none'}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={async (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (!file) return;
                                                    setIsUploading(true);
                                                    try {
                                                        const reader = new FileReader();
                                                        reader.onload = async () => {
                                                            const res = await fetch(UPLOAD_API, {
                                                                method: 'POST',
                                                                headers: { 'Content-Type': 'application/json' },
                                                                body: JSON.stringify({ image: reader.result })
                                                            });
                                                            if (res.ok) {
                                                                const data = await res.json();
                                                                setAchievementFormData(prev => ({ ...prev, image: data.url }));
                                                            } else {
                                                                alert('Upload failed');
                                                            }
                                                            setIsUploading(false);
                                                        };
                                                        reader.readAsDataURL(file);
                                                    } catch (err) {
                                                        console.error(err);
                                                        setIsUploading(false);
                                                    }
                                                }}
                                                style={{ display: 'none' }}
                                                id="ach-image-upload"
                                            />
                                            <motion.label
                                                htmlFor="ach-image-upload"
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '8px',
                                                    padding: '12px 24px',
                                                    background: isUploading ? 'rgba(255,255,255,0.05)' : 'var(--accent)',
                                                    color: 'white',
                                                    borderRadius: '12px',
                                                    fontSize: '14px',
                                                    fontWeight: '600',
                                                    cursor: isUploading ? 'wait' : 'pointer',
                                                    whiteSpace: 'nowrap',
                                                    height: '46px'
                                                }}
                                                whileHover={!isUploading ? { scale: 1.02, background: 'var(--accent-hover)' } : {}}
                                                whileTap={!isUploading ? { scale: 0.98 } : {}}
                                            >
                                                {isUploading ? (
                                                    <div style={{ width: '18px', height: '18px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                                                ) : <HiCloudArrowUp size={20} />}
                                                {isUploading ? 'Uploading...' : 'Upload Image'}
                                            </motion.label>
                                        </div>
                                    </div>
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>External Link (Optional)</label>
                                    <input
                                        type="text"
                                        style={styles.input}
                                        value={achievementFormData.link}
                                        onChange={e => setAchievementFormData({ ...achievementFormData, link: e.target.value })}
                                        placeholder="https://github.com/... or https://youtube.com/..."
                                    />
                                </div>

                                <div style={{ ...styles.formActions, marginTop: '24px' }}>
                                    <motion.button
                                        type="button"
                                        style={styles.cancelButton}
                                        onClick={resetAchievementForm}
                                        whileHover={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)' }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <HiXMark size={16} /> Cancel
                                    </motion.button>
                                    <motion.button
                                        type="submit"
                                        style={styles.submitButton}
                                        whileHover={{ transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(239, 68, 68, 0.3)' }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <HiCheck size={16} /> {achievementFormData.id ? 'Update Achievement' : 'Save Achievement'}
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </div>

            {/* Blog Header Settings Section */}
            {activeTab === 'settings' && (
                <motion.div
                    style={{ marginTop: '64px', padding: '32px', background: 'var(--glass-surface)', border: '1px solid var(--border)', borderRadius: '24px' }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <h2 style={{ ...styles.sectionTitle, marginBottom: '24px', fontSize: '20px' }}>🎬 Blog Header Media</h2>

                    {/* Media Type Tabs */}
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                        <motion.button
                            type="button"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '12px 24px',
                                background: headerSettings.mediaType === 'youtube' ? 'var(--accent)' : 'transparent',
                                border: '1px solid var(--border)',
                                borderRadius: '9999px',
                                color: headerSettings.mediaType === 'youtube' ? 'white' : 'var(--text-secondary)',
                                fontSize: '14px',
                                fontWeight: '500',
                                cursor: 'pointer'
                            }}
                            onClick={() => setHeaderSettings(prev => ({ ...prev, mediaType: 'youtube' }))}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <HiVideoCamera size={18} /> YouTube Video
                        </motion.button>
                        <motion.button
                            type="button"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '12px 24px',
                                background: headerSettings.mediaType === 'carousel' ? 'var(--accent)' : 'transparent',
                                border: '1px solid var(--border)',
                                borderRadius: '9999px',
                                color: headerSettings.mediaType === 'carousel' ? 'white' : 'var(--text-secondary)',
                                fontSize: '14px',
                                fontWeight: '500',
                                cursor: 'pointer'
                            }}
                            onClick={() => setHeaderSettings(prev => ({ ...prev, mediaType: 'carousel' }))}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <HiPhoto size={18} /> Photo Carousel
                        </motion.button>
                    </div>

                    {/* YouTube Mode */}
                    {headerSettings.mediaType === 'youtube' && (
                        <div style={styles.formGroup}>
                            <label style={styles.label}>YouTube Video URL</label>
                            <input
                                type="text"
                                style={styles.input}
                                value={headerSettings.youtubeUrl}
                                onChange={(e) => setHeaderSettings(prev => ({ ...prev, youtubeUrl: e.target.value }))}
                                placeholder="https://www.youtube.com/watch?v=..."
                            />
                            {headerSettings.youtubeUrl && (() => {
                                // Convert YouTube URL to embed format
                                let embedUrl = headerSettings.youtubeUrl;
                                // Handle youtu.be short URLs
                                if (embedUrl.includes('youtu.be/')) {
                                    const videoId = embedUrl.split('youtu.be/')[1].split('?')[0];
                                    embedUrl = `https://www.youtube.com/embed/${videoId}`;
                                }
                                // Handle youtube.com/watch URLs
                                else if (embedUrl.includes('watch?v=')) {
                                    const videoId = embedUrl.split('watch?v=')[1].split('&')[0];
                                    embedUrl = `https://www.youtube.com/embed/${videoId}`;
                                }
                                // Handle youtube.com/embed URLs (already correct)
                                else if (!embedUrl.includes('/embed/')) {
                                    return null;
                                }

                                return (
                                    <div style={{ marginTop: '16px', borderRadius: '12px', overflow: 'hidden', aspectRatio: '16/9', maxWidth: '400px' }}>
                                        <iframe
                                            src={embedUrl}
                                            style={{ width: '100%', height: '100%', border: 'none' }}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                                            allowFullScreen
                                        />
                                    </div>
                                );
                            })()}
                        </div>
                    )}

                    {/* Carousel Mode */}
                    {headerSettings.mediaType === 'carousel' && (
                        <div>
                            <label style={styles.label}>Carousel Images ({headerSettings.carouselImages.length}/5)</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '12px' }}>
                                {headerSettings.carouselImages.map((url, index) => (
                                    <div key={index} style={{ position: 'relative', width: '120px', height: '80px' }}>
                                        <img
                                            src={url}
                                            alt={`Carousel ${index + 1}`}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border)' }}
                                        />
                                        <motion.button
                                            type="button"
                                            style={{
                                                position: 'absolute',
                                                top: '-8px',
                                                right: '-8px',
                                                width: '24px',
                                                height: '24px',
                                                background: '#ef4444',
                                                border: 'none',
                                                borderRadius: '50%',
                                                color: 'white',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer'
                                            }}
                                            onClick={() => removeCarouselImage(index)}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <HiXMark size={14} />
                                        </motion.button>
                                    </div>
                                ))}
                                {headerSettings.carouselImages.length < 5 && (
                                    <label style={{
                                        width: '120px',
                                        height: '80px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: 'rgba(255,255,255,0.03)',
                                        border: '2px dashed var(--border)',
                                        borderRadius: '8px',
                                        cursor: isUploadingCarousel ? 'wait' : 'pointer',
                                        color: 'var(--text-muted)',
                                        fontSize: '13px'
                                    }}>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleCarouselImageUpload}
                                            style={{ display: 'none' }}
                                        />
                                        {isUploadingCarousel ? '...' : <HiPlus size={24} />}
                                    </label>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Save Button */}
                    <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                        <motion.button
                            type="button"
                            style={{ ...styles.submitButton, opacity: isSavingSettings ? 0.7 : 1 }}
                            onClick={saveHeaderSettings}
                            disabled={isSavingSettings}
                            whileHover={{ transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(239, 68, 68, 0.3)' }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <HiCheck size={16} /> {isSavingSettings ? 'Saving...' : 'Save Header Settings'}
                        </motion.button>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default AdminPage;

