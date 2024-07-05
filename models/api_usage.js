const db = require('../services/database');

const ApiUsage = {
    // Create a new API usage record
    createUsage: async (apiKeyId, totalRequests) => {
        try {
            const query = 'INSERT INTO api_usage (api_key_id, total_requests) VALUES (?, ?)';
            const [result] = await db.query(query, [apiKeyId, totalRequests]);
            return result.insertId;
        } catch (error) {
            throw error;
        }
    },

    // Get API usage by API key ID
    getUsageByApiKey: async (apiKeyId) => {
        try {
            const [rows] = await db.query('SELECT * FROM api_usage WHERE api_key_id = ?', [apiKeyId]);
            return rows;
        } catch (error) {
            throw error;
        }
    },

    // Update API usage by API key ID
    updateUsageByApiKey: async (apiKeyId, totalRequests) => {
        try {
            const query = 'UPDATE api_usage SET total_requests = ? WHERE api_key_id = ?';
            await db.query(query, [totalRequests, apiKeyId]);
            return true;
        } catch (error) {
            throw error;
        }
    },

    // Delete API usage by API key ID
    deleteUsageByApiKey: async (apiKeyId) => {
        try {
            await db.query('DELETE FROM api_usage WHERE api_key_id = ?', [apiKeyId]);
            return true;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = ApiUsage;
