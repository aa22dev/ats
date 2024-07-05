const db = require('../services/database');

const Experience = {
    // Create a new experience record
    createExperience: async (applicantId, title, company, startDate, endDate, description) => {
        try {
            const query = 'INSERT INTO experience (applicant_id, title, company, start_date, end_date, description) VALUES (?, ?, ?, ?, ?, ?)';
            const [result] = await db.query(query, [applicantId, title, company, startDate, endDate, description]);
            return result.insertId;
        } catch (error) {
            throw error;
        }
    },

    getExperienceByApplicantId: async (applicantId) => {
        try {
            const [rows] = await db.query('SELECT * FROM experience WHERE applicant_id = ?', [applicantId]);
            return rows;
        } catch (error) {
            throw error;
        }
    },

    // Get experience record by ID
    getExperienceById: async (experienceId) => {
        try {
            const [rows] = await db.query('SELECT * FROM experience WHERE experience_id = ?', [experienceId]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    },

    update: async (applicant_id, experience_id, updatedFields, values) => {
        try {
            const query = `UPDATE experience SET ${updatedFields} WHERE experience_id = ? and applicant_id = ?`;
            await db.query(query, [...values, experience_id, applicant_id]);
            return true;
        } catch (error) {
            throw error;
        }
    },

    // Update experience record
    updateExperience: async (experienceId, title, company, startDate, endDate, description) => {
        try {
            const query = 'UPDATE experience SET title = ?, company = ?, start_date = ?, end_date = ?, description = ? WHERE experience_id = ?';
            await db.query(query, [title, company, startDate, endDate, description, experienceId]);
            return true;
        } catch (error) {
            throw error;
        }
    },

    // Delete experience record by ID
    deleteExperience: async (experienceId) => {
        try {
            await db.query('DELETE FROM experience WHERE experience_id = ?', [experienceId]);
            return true;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = Experience;
