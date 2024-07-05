const db = require('../services/database');

const User = {
    role: '',
    getRole: function () {
        return this.role;
    },

    // Create a new user
    create: async function (userData) {
        try {
            const { company_id, username, email, password_hash } = userData;
            const query = 'INSERT INTO users (company_id, username, email, password_hash, role) VALUES (?, ?, ?, ?, ?)';
            const [result] = await db.query(query, [company_id, username, email, password_hash, this.role]);
            return result.insertId;
        } catch (error) {
            throw error;
        }
    },

    // Get User by Email
    getByEmail: async function (email, companyId) {
        try {
            const [rows] = await db.query('SELECT * FROM users WHERE email = ? and role = ? and company_id = ?', [email, this.role, companyId]);
            return rows[0];
        } catch(error) {
            throw error;
        }
    },

    getByUsername: async function (username, companyId) {
        try {
            const [rows] = await db.query('SELECT * FROM users WHERE username = ? and role = ? and company_id = ?', [username, this.role, companyId]);
            return rows[0];
        } catch(error) {
            throw error;
        }
    },

    // Get user by ID
    getUserById: async (userId) => {
        try {
            const [rows] = await db.query('SELECT * FROM users WHERE user_id = ?', [userId]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    },

    // Get user by email
    getUserByEmail: async (email, role) => {
        try {
            const [rows] = await db.query('SELECT * FROM users WHERE email = ? and role = ?', [email, role]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    },

    // Get user by username
    getUserByUsername: async (username) => {
        try {
            const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    },

    update: async (userId, companyId, updateFields, values) => {
        try {
            const query = `Update users SET ${updateFields} WHERE user_id = ? AND company_id = ?`;
            await db.query(query, [...values, userId, companyId]);
            return true;
        } catch (error) {
            throw error;
        }
    },

    // Update user details
    updateUser: async (userId, companyId, userData) => {
        try {
            const { username, email, password_hash, role } = userData;
            const query = 'UPDATE users SET username = ?, email = ?, password_hash = ?, role = ? WHERE user_id = ? AND company_id = ?';
            await db.query(query, [username, email, password_hash, role, userId, companyId]);
            return true;
        } catch (error) {
            throw error;
        }
    },

    // Delete user by ID
    deleteUser: async (userId, companyId) => {
        try {
            await db.query('DELETE FROM users WHERE user_id = ? AND company_id = ?', [userId, companyId]);
            return true;
        } catch (error) {
            throw error;
        }
    },

    // Get all users by company ID
    getAllUsersByCompanyId: async (companyId) => {
        try {
            const [rows] = await db.query('SELECT * FROM users WHERE company_id = ?', [companyId]);
            return rows;
        } catch (error) {
            throw error;
        }
    },

};

module.exports = User;
