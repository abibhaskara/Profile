/* Abi Bhaskara copyright 2025 */
import { v2 as cloudinary } from 'cloudinary';
import { setCorsHeaders, handlePreflight } from './_lib/cors.js';

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb'
        }
    }
};

export default async function handler(req, res) {
    setCorsHeaders(res, ['POST', 'OPTIONS']);
    if (handlePreflight(req, res)) return;

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

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
            console.error('Cloudinary config missing:', { hasCloudName: !!cloudName, hasApiKey: !!apiKey, hasApiSecret: !!apiSecret });
            return res.status(500).json({
                error: 'Upload service not configured'
            });
        }

        // Configure Cloudinary inside handler
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
