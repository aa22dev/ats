const db = require('../services/database');

const Recommendations = {
    get: async(applicant_id) => {
        try {
            const [rows] = await db.query('SELECT * FROM recommendations WHERE applicant_id = ?', [applicant_id]);
            return rows;
        } catch (error) {
            throw error;
        }
    },

    // function where multiple recommendations are in array in recommendations variable store them in database
    create: async(recommendations) => {
        try {
            const values = recommendations.map(item => [item.applicant_id, item.job_id, item.score]);
            const [rows] = await db.query('INSERT INTO recommendations (applicant_id, job_id, score) VALUES ?', [values]);
            return rows;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Recommendations;