const db = require('../services/database');

const JobSkills = {
    // Add skills required for a job
    addSkillsForJob: async (jobId, skillIds) => {
        try {
            const values = skillIds.map(skillId => [jobId, skillId]);
            const query = 'INSERT INTO job_skills (job_id, skill_id) VALUES ?';
            await db.query(query, [values]);
            return true;
        } catch (error) {
            throw error;
        }
    },

    // Get skills required for a job
    getSkillsForJob: async (jobId) => {
        try {
            const [rows] = await db.query('SELECT * FROM job_skills WHERE job_id = ?', [jobId]);
            return rows;
        } catch (error) {
            throw error;
        }
    },

    // Remove skills associated with a job
    removeSkillsForJob: async (jobId) => {
        try {
            await db.query('DELETE FROM job_skills WHERE job_id = ?', [jobId]);
            return true;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = JobSkills;
