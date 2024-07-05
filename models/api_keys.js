const db = require('../services/database');

const ApiKey = {
    // Create a new API key
    createApiKey: async (companyId, apiKey, subscriptionPlan, rateLimit, usageLimit) => {
        try {
            const query = 'INSERT INTO api_keys (company_id, api_key, subscription_plan, rate_limit, usage_limit) VALUES (?, ?, ?, ?, ?)';
            const [result] = await db.query(query, [companyId, apiKey, subscriptionPlan, rateLimit, usageLimit]);
            return result.insertId;
        } catch (error) {
            throw error;
        }
    },

    getApiKey: async (apiKey) => {
        try {
            const [rows] = await db.query('SELECT * FROM api_keys WHERE api_key = ?', [apiKey]);
            return rows[0];
        } catch(error) {
            throw error;
        }
    },

    // Get API key by ID
    getApiKeyById: async (apiKeyId) => {
        try {
            const [rows] = await db.query('SELECT * FROM api_keys WHERE api_key_id = ?', [apiKeyId]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    },

    // Update API key
    updateApiKey: async (apiKeyId, subscriptionPlan, rateLimit, usageLimit) => {
        try {
            const query = 'UPDATE api_keys SET subscription_plan = ?, rate_limit = ?, usage_limit = ? WHERE api_key_id = ?';
            await db.query(query, [subscriptionPlan, rateLimit, usageLimit, apiKeyId]);
            return true;
        } catch (error) {
            throw error;
        }
    },

    // Delete API key by ID
    deleteApiKey: async (apiKeyId) => {
        try {
            await db.query('DELETE FROM api_keys WHERE api_key_id = ?', [apiKeyId]);
            return true;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = ApiKey;
