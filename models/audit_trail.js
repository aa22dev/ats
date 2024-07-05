const db = require('../services/database');

const AuditTrail = {
    // Create a new audit trail entry
    createAuditTrailEntry: async (userId, action) => {
        try {
            const query = 'INSERT INTO audit_trail (user_id, action) VALUES (?, ?)';
            const [result] = await db.query(query, [userId, action]);
            return result.insertId;
        } catch (error) {
            throw error;
        }
    },

    // Get audit trail entries for a user
    getAuditTrailEntriesByUser: async (userId) => {
        try {
            const [rows] = await db.query('SELECT * FROM audit_trail WHERE user_id = ?', [userId]);
            return rows;
        } catch (error) {
            throw error;
        }
    },

    // Delete audit trail entries for a user
    deleteAuditTrailEntriesByUser: async (userId) => {
        try {
            await db.query('DELETE FROM audit_trail WHERE user_id = ?', [userId]);
            return true;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = AuditTrail;
