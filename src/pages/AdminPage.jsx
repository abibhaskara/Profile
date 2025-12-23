/* Abi Bhaskara copyright 2025 */
import { useState, useEffect, useMemo, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { HiPlus, HiPencil, HiTrash, HiCheck, HiXMark, HiCloudArrowUp, HiPhoto, HiVideoCamera } from 'react-icons/hi2';

// API URLs
const API_BASE = import.meta.env.DEV ? 'http://localhost:3001/api/posts' : '/api/posts';
const SETTINGS_API = import.meta.env.DEV ? 'http://localhost:3001/api/settings' : '/api/settings';
const UPLOAD_API = import.meta.env.DEV ? 'http://localhost:3001/api/upload' : '/api/upload';

const AdminPage = () => {
    const [posts, setPosts] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        description: '',
        content: '',
        image: '',
        tags: ''
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

    useEffect(() => {
        fetchPosts();
        fetchHeaderSettings();
    }, []);

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
                alert('Failed to save settings');
            }
        } catch (err) {
            console.error('Save settings error:', err);
            alert('Error saving settings');
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
            tags: ''
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
        grid: {
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '32px'
        },
        gridLarge: {
            display: 'grid',
            gridTemplateColumns: '350px 1fr',
            gap: '48px'
        },
        sidebar: {
            borderRight: '1px solid var(--border)',
            paddingRight: '32px'
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
        postCard: {
            padding: '16px',
            background: 'var(--glass-surface)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            marginBottom: '12px',
            transition: 'border-color 0.2s, background 0.2s'
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
                CMS Dashboard
            </motion.h1>

            <div style={isDesktop ? styles.gridLarge : styles.grid}>
                {/* Sidebar - Posts List */}
                <motion.div
                    style={isDesktop ? styles.sidebar : {}}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <div style={styles.sidebarHeader}>
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

                {/* Main - Editor Form */}
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
            </div>

            {/* Blog Header Settings Section */}
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
        </div>
    );
};

export default AdminPage;

