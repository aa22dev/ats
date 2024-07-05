const db = require('../services/database');

const AllowedOrigin = {
    // Create a new allowed origin record
    createAllowedOrigin: async (apiKeyId, originUrl) => {
        try {
            const query = 'INSERT INTO allowed_origins (api_key_id, origin_url) VALUES (?, ?)';
            const [result] = await db.query(query, [apiKeyId, originUrl]);
            return result.insertId;
        } catch (error) {
            throw error;
        }
    },

    getAllowedOrigin: async(apiKeyId) => {
        try {
            const [rows] = await db.query('SELECT * FROM allowed_origins WHERE api_key_id = ?', [apiKeyId]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    },

    // Get allowed origin record by ID
    getAllowedOriginById: async (allowedOriginId) => {
        try {
            const [rows] = await db.query('SELECT * FROM allowed_origins WHERE allowed_origin_id = ?', [allowedOriginId]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    },

    // Update allowed origin record
    updateAllowedOrigin: async (allowedOriginId, originUrl) => {
        try {
            const query = 'UPDATE allowed_origins SET origin_url = ? WHERE allowed_origin_id = ?';
            await db.query(query, [originUrl, allowedOriginId]);
            return true;
        } catch (error) {
            throw error;
        }
    },

    // Delete allowed origin record by ID
    deleteAllowedOrigin: async (allowedOriginId) => {
        try {
            await db.query('DELETE FROM allowed_origins WHERE allowed_origin_id = ?', [allowedOriginId]);
            return true;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = AllowedOrigin;
