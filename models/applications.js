const db = require('../services/database');

const Application = {
    create: async (applicationData) => {
        try {
            const { job_id, applicant_id, status } = applicationData;
            const query = 'INSERT INTO applications (job_id, applicant_id, status) VALUES (?, ?, ?)';
            const [result] = await db.query(query, [job_id, applicant_id, status]);
            return result.insertId;
        } catch (error) {
            throw error;
        }
    },
    getByApplicantId: async (applicantId) => {
        try {
            const query = `SELECT j.job_id, 
		                        c.company_name, 
                                j.title, 
                                j.description, 
                                a.status, 
                                a.date_applied, 
                                j.salary 
                            FROM applications as a
                            INNER JOIN jobs as j
                                ON j.job_id = a.job_id
                            INNER JOIN companies as c
                                ON c.company_id = j.company_id
                            WHERE a.applicant_id = ?`;
            const [applications] = await db.query(query, [applicantId]);
            return applications;
        } catch (error) {
            throw error;
        }
    },
    getByJobId: async (jobId) => {
        try {
            const query = `SELECT j.job_id, 
		                        c.company_name, 
                                j.title, 
                                j.description, 
                                a.status, 
                                a.date_applied, 
                                j.salary 
                            FROM applications as a
                            INNER JOIN jobs as j
                                ON j.job_id = a.job_id
                            INNER JOIN companies as c
                                ON c.company_id = j.company_id
                            WHERE a.job_id = ?`;
            const [applications] = await db.query(query, [jobId]);
            return applications;
        } catch (error) {
            throw error;
        }
    },
    getById: async (applicationId) => {
        try {
            const query = 'SELECT * FROM applications WHERE application_id = ?';
            const [application] = await db.query(query, [applicationId]);
            return application[0];
        } catch (error) {
            throw error;
        }
    },
    updateStatus: async (applicationId, status) => {
        try {
            const query = 'UPDATE applications SET status = ? WHERE application_id = ?';
            await db.query(query, [status, applicationId]);
            return true;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = Application;
