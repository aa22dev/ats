const db = require('../services/database');
const User = require('./users.js')
const Education = require('./education.js');
const Experience = require('./experience.js');
const Skills = require('./user_skills.js');

User.role = 'applicant';

const Applicant = {
    user: User,
    education: Education,
    experience: Experience,
    skills: Skills,
    create: async (applicantData) => {
        try {
            const { user_id, name, github, linkedin_profile, resume_url } = applicantData;
            const query = 'INSERT INTO applicants (user_id, name, github, linkedin_profile, resume_url) VALUES (?, ?, ?, ?, ?)';
            const [result] = await db.query(query, [user_id, name, github, linkedin_profile, resume_url]);
            return result.insertId;
        } catch (error) {
            throw error;
        }
    },

    updateDp: async(userId, dp) => {
        try {
            const query = 'UPDATE applicants SET profile_picture = ? WHERE user_id = ?';
            await db.query(query, [dp, userId]);
            return true;
        } catch(error) {
            throw error;
        }
    },

    getProfile: async(userId) => {
        try {
            const [rows] = await db.query('SELECT u.user_id, a.applicant_id, u.company_id, u.username, u.email, a.name, a.city, a.country, a.github, a.linkedin_profile, a.resume_url, a.profile_picture, u.created_at, u.updated_at FROM users as u INNER JOIN applicants as a ON u.user_id = a.user_id WHERE u.user_id = ?', [userId]);
            return rows[0];
        } catch(error) {
            throw error;
        }
    },

    getProfilePicture: async(userId) => {
        try {
            const [rows] = await db.query('SELECT profile_picture FROM applicants WHERE user_id = ?', [userId]);
            return rows[0].profile_picture;
        } catch(error) {
            throw error;
        }
    },

    // Get applicant by ID
    getApplicantDetailsById: async (applicantId) => {
        try {
            const [rows] = await db.query('SELECT * FROM applicants WHERE applicant_id = ?', [applicantId]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    },

    update: async(applicantId, updatedFields, values) => {
        try {
            const query = `UPDATE applicants SET ${updatedFields} WHERE applicant_id = ?`;
            await db.query(query, [...values, applicantId]);
            return true;
        } catch (error) {
            throw error;
        }
    },

    // Update applicant details
    updateApplicant: async (applicantId, applicantData) => {
        try {
            const { name, github, linkedin_profile, resume_url } = applicantData;
            const query = 'UPDATE applicants SET name = ?, github = ?, linkedin_profile = ?, resume_url = ? WHERE applicant_id = ?';
            await db.query(query, [name, github, linkedin_profile, resume_url, applicantId]);
            return true;
        } catch (error) {
            throw error;
        }
    },

    // Delete applicant by ID
    deleteApplicant: async (applicantId) => {
        try {
            await db.query('DELETE FROM applicants WHERE applicant_id = ?', [applicantId]);
            return true;
        } catch (error) {
            throw error;
        }
    },

    getApplicantByEmail: async(email) => {
        try {
            return await User.getUserByEmail(email, 'applicant');
        } catch (error) {
            throw error;
        }
    }

    // Additional methods based on your requirements:
    // - Get applicant by user ID
    // - Get applicants by job ID
    // - Search for applicants
    // - Count total applicants
    // - And any other specific methods
};

module.exports = Applicant;
