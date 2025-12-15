/* Abi Bhaskara copyright 2025 */
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb'
        }
    }
};

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { image } = req.body;

        if (!image) {
            return res.status(400).json({ error: 'No image provided' });
        }

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(image, {
            folder: 'portfolio-blog',
            resource_type: 'auto',
            transformation: [
                { quality: 'auto:good' },
                { fetch_format: 'auto' }
            ]
        });

        return res.status(200).json({
            url: result.secure_url,
            public_id: result.public_id,
            width: result.width,
            height: result.height
        });

    } catch (error) {
        console.error('Upload error:', error);
        return res.status(500).json({
            error: 'Upload failed',
            message: error.message
        });
    }
}
