const db = require('../services/database');

const ApiRequestLog = {
    // Create a new API request log
    createLog: async (apiKeyId, requestUrl, requestMethod, requestHeaders, requestBody, responseStatus, responseBody, clientIp) => {
        try {
            const query = 'INSERT INTO api_request_logs (api_key_id, request_url, request_method, request_headers, request_body, response_status, response_body, client_ip) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
            const [result] = await db.query(query, [apiKeyId, requestUrl, requestMethod, requestHeaders, requestBody, responseStatus, responseBody, clientIp]);
            return result.insertId;
        } catch (error) {
            throw error;
        }
    },

    // Get API request logs by API key ID
    getLogsByApiKey: async (apiKeyId) => {
        try {
            const [rows] = await db.query('SELECT * FROM api_request_logs WHERE api_key_id = ?', [apiKeyId]);
            return rows;
        } catch (error) {
            throw error;
        }
    },

    // Delete API request logs by API key ID
    deleteLogsByApiKey: async (apiKeyId) => {
        try {
            await db.query('DELETE FROM api_request_logs WHERE api_key_id = ?', [apiKeyId]);
            return true;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = ApiRequestLog;
