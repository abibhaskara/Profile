/* Abi Bhaskara copyright 2025 */

/**
 * Set CORS headers for API responses
 * @param {Object} res - Response object
 * @param {string[]} methods - Allowed HTTP methods
 */
export function setCorsHeaders(res, methods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']) {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', methods.join(','));
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

/**
 * Handle OPTIONS preflight request
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {boolean} - True if handled (caller should return)
 */
export function handlePreflight(req, res) {
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return true;
    }
    return false;
}
