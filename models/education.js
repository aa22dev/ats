const db = require('../services/database');

const Education = {
    // Create a new education record
    createEducation: async (applicantId, degree, major, institution, startDate, endDate) => {
        try {
            const query = 'INSERT INTO education (applicant_id, degree, major, institution, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?)';
            const [result] = await db.query(query, [applicantId, degree, major, institution, startDate, endDate]);
            return result.insertId;
        } catch (error) {
            throw error;
        }
    },

    getEducationByApplicantId: async(applicantId) => {
        try {
            const [rows] = await db.query('SELECT * FROM education WHERE applicant_id = ?', [applicantId]);
            return rows;
        } catch (error) {
            throw error;
        }
    },

    // Get education record by ID
    getEducationById: async (educationId) => {
        try {
            const [rows] = await db.query('SELECT * FROM education WHERE education_id = ?', [educationId]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    },

    update: async (applicant_id, educationId, updatedFields, values) => {
        try {
            const query = `UPDATE education SET ${updatedFields} WHERE education_id = ? and applicant_id = ?`;
            await db.query(query, [...values, educationId, applicant_id]);
            return true;
        } catch (error) {
            throw error;
        }
    },


    // Update education record
    updateEducation: async (educationId, degree, major, institution, startDate, endDate) => {
        try {
            const query = 'UPDATE education SET degree = ?, major = ?, institution = ?, start_date = ?, end_date = ? WHERE education_id = ?';
            await db.query(query, [degree, major, institution, startDate, endDate, educationId]);
            return true;
        } catch (error) {
            throw error;
        }
    },

    // Delete education record by ID
    deleteEducation: async (educationId) => {
        try {
            await db.query('DELETE FROM education WHERE education_id = ?', [educationId]);
            return true;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = Education;
