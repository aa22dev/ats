const db = require('../services/database');

const SmtpConfigurations = {
    // Create new SMTP configuration
    createSmtpConfiguration: async (companyId, smtpHost, smtpPort, smtpUsername, smtpPassword, smtpSecure) => {
        try {
            const query = 'INSERT INTO smtp_configurations (company_id, smtp_host, smtp_port, smtp_username, smtp_password, smtp_secure) VALUES (?, ?, ?, ?, ?, ?)';
            await db.query(query, [companyId, smtpHost, smtpPort, smtpUsername, smtpPassword, smtpSecure]);
            return true;
        } catch (error) {
            throw error;
        }
    },

    // Get SMTP configuration by company ID
    getByCompanyId: async (companyId) => {
        try {
            const [rows] = await db.query('SELECT * FROM smtp_configurations WHERE company_id = ?', [companyId]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    },

    // Update SMTP configuration
    updateSmtpConfiguration: async (companyId, smtpHost, smtpPort, smtpUsername, smtpPassword, smtpSecure) => {
        try {
            await db.query('UPDATE smtp_configurations SET smtp_host = ?, smtp_port = ?, smtp_username = ?, smtp_password = ?, smtp_secure = ? WHERE company_id = ?',
                [smtpHost, smtpPort, smtpUsername, smtpPassword, smtpSecure, companyId]);
            return true;
        } catch (error) {
            throw error;
        }
    },

    // Delete SMTP configuration
    deleteSmtpConfiguration: async (companyId) => {
        try {
            await db.query('DELETE FROM smtp_configurations WHERE company_id = ?', [companyId]);
            return true;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = SmtpConfigurations;
