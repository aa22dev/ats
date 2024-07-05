const db = require('../services/database');

const Job = {
    // Create a new job
    createJob: async (jobData) => {
        try {
            const { company_id, title, description, requirements, salary, status, deadline } = jobData;
            const query = 'INSERT INTO jobs (company_id, title, description, requirements, salary, status, deadline) VALUES (?, ?, ?, ?, ?, ?, ?)';
            const [result] = await db.query(query, [company_id, title, description, requirements, salary, status, deadline]);
            return result.insertId;
        } catch (error) {
            throw error;
        }
    },

    // Get job by ID
    getJobById: async (jobId, companyId) => {
        try {
            const [rows] = await db.query('SELECT * FROM jobs WHERE job_id = ? AND company_id = ?', [jobId, companyId]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    },

    getJobsByIds: async (jobId, companyId) => {
        try {
            const [rows] = await db.query('SELECT * FROM jobs WHERE job_id IN (?) AND company_id = ?', [jobId, companyId]);
            return rows;
        } catch (error) {
            throw error;
        }
    },

    // Update job details
    updateJob: async (jobId, companyId, jobData) => {
        try {
            const { title, description, requirements, salary, status, deadline } = jobData;
            const query = 'UPDATE jobs SET title = ?, description = ?, requirements = ?, salary = ?, status = ?, deadline = ? WHERE job_id = ? AND company_id = ?';
            await db.query(query, [title, description, requirements, salary, status, deadline, jobId, companyId]);
            return true;
        } catch (error) {
            throw error;
        }
    },

    // Delete job by ID
    deleteJob: async (jobId, companyId) => {
        try {
            await db.query('DELETE FROM jobs WHERE job_id = ? AND company_id = ?', [jobId, companyId]);
            return true;
        } catch (error) {
            throw error;
        }
    },

    getTotalJobsOfCompany: async function (companyId) {
        try {
            const query = `SELECT 
                                COUNT(job_id) as total
                            FROM 
                                jobs
                            WHERE 
                                status = 'active' and deadline > NOW() and company_id = ?`;
            const [rows] = await db.query(query, [companyId]);
            return rows[0].total;
        } catch (error) {
            throw error;
        }
    },

    // Get all jobs by company ID
    getJobsByCompanyId: async (companyId, offset=0, batch_size=10) => {
        try {
            const query = `SELECT 
                                j.job_id, 
                                j.title, 
                                j.description, 
                                j.requirements, 
                                j.experience, 
                                j.education, 
                                j.salary, 
                                j.deadline, 
                                GROUP_CONCAT(s.name) AS skills 
                            FROM 
                                jobs as j 
                            LEFT JOIN 
                                job_skills as js ON j.job_id = js.job_id 
                            LEFT JOIN 
                                skills as s ON js.skill_id = s.skill_id 
                            WHERE 
                                j.status = 'active' and j.deadline > NOW() and j.company_id = ? 
                            GROUP BY 
                                j.job_id
                            LIMIT ?, ?`;
            const [rows] = await db.query(query, [companyId, offset, batch_size]);
            return rows;
        } catch (error) {
            throw error;
        }
    },

    getJobsByCompanyIdForDatatable: async function (companyId, body) {
        try {
            const { draw, start, length } = body;
            const searchValue = body['search[value]'];
            const orderColumnIndex = body['order[0][column]'];
            const orderDirection = body['order[0][dir]'];

            const values = []

            let query = `SELECT 
                                j.job_id, 
                                j.title, 
                                j.description, 
                                j.requirements, 
                                j.experience, 
                                j.education, 
                                j.salary, 
                                j.deadline, 
                                GROUP_CONCAT(s.name) AS skills 
                            FROM 
                                jobs as j 
                            LEFT JOIN 
                                job_skills as js ON j.job_id = js.job_id 
                            LEFT JOIN 
                                skills as s ON js.skill_id = s.skill_id 
                            WHERE 
                                j.status = 'active' and j.deadline > NOW() and j.company_id = ?`;
            values.push(companyId)

            if (searchValue) {
                query += ` AND j.title LIKE ? 
                            OR j.description LIKE ? 
                            OR j.requirements LIKE ? 
                            OR skills LIKE ?
                            OR j.experience LIKE ?
                            OR j.education LIKE ?
                            OR j.salary LIKE ?`;
                values.push(`%${searchValue}%`, `%${searchValue}%`, `%${searchValue}%`, `%${searchValue}%`, `%${searchValue}%`, `%${searchValue}%`, `%${searchValue}%`);
            }

            if (orderColumnIndex) {
                const orderColumn = body[`columns[${orderColumnIndex}][data]`];
                query += ` ORDER BY ? ?`;
                values.push(orderColumn, orderDirection);
            }

            query += ` GROUP BY j.job_id`;

            query += ` LIMIT ?, ?`;
            values.push(parseInt(start), parseInt(length))

            const [rows] = await db.query(query, values);

            const recordsTotal = await this.getTotalJobsOfCompany(companyId);
            const recordsFiltered = searchValue ? rows.length : recordsTotal;

            return [draw, recordsTotal, recordsFiltered, rows];
        } catch (error) {
            throw error;
        }
    },

    // Additional methods based on your requirements:
    // - Get active jobs
    // - Filter jobs by category
    // - Search for jobs
    // - Count total jobs
    // - And any other specific methods

};

module.exports = Job;
