/* Abi Bhaskara copyright 2025 */
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import postsRouter from './routes/posts.js';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/posts', postsRouter);

// Serve static files (optional, if we want to serve the React app from here too later)
// const __dirname = dirname(fileURLToPath(import.meta.url));
// app.use(express.static(join(__dirname, '../dist')));

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
