const db = require('../services/database');

const Sessions = {
    // Create a new session
    createSession: async (userId, token, expirationTime) => {
        try {
            const query = 'INSERT INTO sessions (user_id, token, expiration_time) VALUES (?, ?, ?)';
            await db.query(query, [userId, token, expirationTime]);
            return true;
        } catch (error) {
            throw error;
        }
    },

    // Get a session by token
    getSessionByToken: async (token) => {
        try {
            const [rows] = await db.query('SELECT * FROM sessions WHERE token = ? and expiration_time > NOW()', [token]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    },

    // Update a session's expiration time
    updateSessionExpiration: async (token, expirationTime) => {
        try {
            await db.query('UPDATE sessions SET expiration_time = ? WHERE token = ?', [expirationTime, token]);
            return true;
        } catch (error) {
            throw error;
        }
    },

    // Delete a session
    deleteSession: async (token) => {
        try {
            await db.query('DELETE FROM sessions WHERE token = ?', [token]);
            return true;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = Sessions;
