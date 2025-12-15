/* Abi Bhaskara copyright 2025 */
import express from 'express';
import { v2 as cloudinary } from 'cloudinary';

const router = express.Router();

// Parse JSON body with higher limit for base64 images
router.use(express.json({ limit: '10mb' }));

router.post('/', async (req, res) => {
    try {
        const { image } = req.body;

        if (!image) {
            return res.status(400).json({ error: 'No image provided' });
        }

        // Check if credentials are configured
        const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
        const apiKey = process.env.CLOUDINARY_API_KEY;
        const apiSecret = process.env.CLOUDINARY_API_SECRET;

        if (!cloudName || !apiKey || !apiSecret) {
            console.error('Cloudinary config missing');
            return res.status(500).json({
                error: 'Upload service not configured (check .env)'
            });
        }

        // Configure Cloudinary
        cloudinary.config({
            cloud_name: cloudName,
            api_key: apiKey,
            api_secret: apiSecret
        });

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(image, {
            folder: 'portfolio-blog',
            resource_type: 'auto',
            transformation: [
                { quality: 'auto:good' },
                { fetch_format: 'auto' }
            ]
        });

        res.status(200).json({
            url: result.secure_url,
            public_id: result.public_id,
            width: result.width,
            height: result.height
        });

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            error: 'Upload failed',
            message: error.message
        });
    }
});

export default router;
