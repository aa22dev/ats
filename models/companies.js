const db = require('../services/database');

const Company = {
    // Create a new company
    create: async (companyData) => {
        try {
            const { company_name, company_email } = companyData;
            const query = 'INSERT INTO companies (company_name, company_email) VALUES (?, ?)';
            const [result] = await db.query(query, [company_name, company_email]);
            return result.insertId;
        } catch (error) {
            throw error;
        }
    },

    // Get company by ID
    getById: async (companyId) => {
        try {
            const [rows] = await db.query('SELECT * FROM companies WHERE company_id = ?', [companyId]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    },

    // Update company details
    update: async (companyId, companyData) => {
        try {
            const { company_name, company_email } = companyData;
            const query = 'UPDATE companies SET company_name = ?, company_email = ? WHERE company_id = ?';
            await db.query(query, [company_name, company_email, companyId]);
            return true;
        } catch (error) {
            throw error;
        }
    },

    // Delete company by ID
    delete: async (companyId) => {
        try {
            await db.query('DELETE FROM companies WHERE company_id = ?', [companyId]);
            return true;
        } catch (error) {
            throw error;
        }
    },

    // Get all companies
    getAll: async () => {
        try {
            const [rows] = await db.query('SELECT * FROM companies');
            return rows;
        } catch (error) {
            throw error;
        }
    },

    storeSessionToken: async (userId, sessionToken) => {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 1); // Session token valid for 1 day
        await db.query('UPDATE users SET session_token = ?, session_expiry = ? WHERE id = ?', [sessionToken, expiryDate, userId]);
    },

    // Additional methods based on your requirements:
    // - Search companies by name or email
    // - Get company users
    // - Get company jobs
    // - Get company API key
    // - Get company SMTP configuration
    // - Get company system settings
    // - Get company audit trail
    // - Get company API usage
    // - And any other specific methods

};

module.exports = Company;
