/**
 * Image Optimization Script
 * Resizes and compresses images for web compatibility
 * 
 * Run: node scripts/optimize-images.js
 */

import sharp from 'sharp';
import { readdir, mkdir, stat } from 'fs/promises';
import { join, extname, basename, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const CONFIG = {
    // Max dimensions for different image types
    maxWidth: 1200,
    maxHeight: 900,
    // JPEG quality (1-100)
    quality: 80,
    // Directories to process
    directories: [
        join(__dirname, '../public/achievements'),
        join(__dirname, '../public/blog'),
        join(__dirname, '../src/assets')
    ],
    // Supported extensions
    supportedExtensions: ['.jpg', '.jpeg', '.png', '.webp', '.JPG', '.JPEG', '.PNG']
};

// Format bytes to human readable
function formatBytes(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / 1048576).toFixed(2) + ' MB';
}

// Process a single image
async function processImage(filePath) {
    const ext = extname(filePath).toLowerCase();
    const name = basename(filePath);

    try {
        const stats = await stat(filePath);
        const originalSize = stats.size;

        // Skip if already small (< 500KB)
        if (originalSize < 500 * 1024) {
            console.log(`⏭️  Skipping ${name} (already optimized: ${formatBytes(originalSize)})`);
            return { skipped: true };
        }

        console.log(`🔄 Processing ${name} (${formatBytes(originalSize)})...`);

        // Read and process the image
        let sharpInstance = sharp(filePath);
        const metadata = await sharpInstance.metadata();

        // Resize if larger than max dimensions
        if (metadata.width > CONFIG.maxWidth || metadata.height > CONFIG.maxHeight) {
            sharpInstance = sharpInstance.resize(CONFIG.maxWidth, CONFIG.maxHeight, {
                fit: 'inside',
                withoutEnlargement: true
            });
        }

        // Output based on format
        let outputBuffer;
        if (ext === '.png') {
            outputBuffer = await sharpInstance
                .png({ quality: CONFIG.quality, compressionLevel: 9 })
                .toBuffer();
        } else {
            // Convert JPEG/JPG and optimize
            outputBuffer = await sharpInstance
                .jpeg({ quality: CONFIG.quality, mozjpeg: true })
                .toBuffer();
        }

        const newSize = outputBuffer.length;
        const savings = ((originalSize - newSize) / originalSize * 100).toFixed(1);

        // Only save if we actually reduced size
        if (newSize < originalSize) {
            await sharp(outputBuffer).toFile(filePath);
            console.log(`✅ ${name}: ${formatBytes(originalSize)} → ${formatBytes(newSize)} (-${savings}%)`);
            return {
                original: originalSize,
                optimized: newSize,
                saved: originalSize - newSize
            };
        } else {
            console.log(`⏭️  ${name}: No size reduction possible`);
            return { skipped: true };
        }

    } catch (error) {
        console.error(`❌ Error processing ${name}:`, error.message);
        return { error: true };
    }
}

// Process all images in a directory
async function processDirectory(dirPath) {
    try {
        const files = await readdir(dirPath);
        const results = [];

        for (const file of files) {
            const ext = extname(file).toLowerCase();
            if (CONFIG.supportedExtensions.includes(ext) || CONFIG.supportedExtensions.includes(extname(file))) {
                const result = await processImage(join(dirPath, file));
                results.push(result);
            }
        }

        return results;
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.log(`📁 Directory not found: ${dirPath}`);
        } else {
            console.error(`❌ Error reading directory ${dirPath}:`, error.message);
        }
        return [];
    }
}

// Main function
async function main() {
    console.log('🖼️  Image Optimization Script');
    console.log('============================\n');

    let totalOriginal = 0;
    let totalOptimized = 0;
    let processedCount = 0;

    for (const dir of CONFIG.directories) {
        console.log(`\n📂 Processing: ${dir}\n`);
        const results = await processDirectory(dir);

        for (const result of results) {
            if (result.original) {
                totalOriginal += result.original;
                totalOptimized += result.optimized;
                processedCount++;
            }
        }
    }

    console.log('\n============================');
    console.log('📊 Summary:');
    console.log(`   Images optimized: ${processedCount}`);
    if (processedCount > 0) {
        console.log(`   Original total: ${formatBytes(totalOriginal)}`);
        console.log(`   Optimized total: ${formatBytes(totalOptimized)}`);
        console.log(`   Total saved: ${formatBytes(totalOriginal - totalOptimized)}`);
    }
    console.log('============================\n');
}

main().catch(console.error);
