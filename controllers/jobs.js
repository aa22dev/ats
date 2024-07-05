const Jobs = require('../models/jobs.js');

const jobController = {
    get: async(req, res, next) => {
        try {
            const companyId = req.body.companyId;

            const { isDatatable } = req.body;

            let jobs = null;
            let draw = null;
            let recordsTotal = null;
            let recordsFiltered = null;

            if (isDatatable) {
                [draw, recordsTotal, recordsFiltered, jobs] = await Jobs.getJobsByCompanyIdForDatatable(companyId, req.body);
            } else {
                jobs = await Jobs.getJobsByCompanyId(companyId);
            }
            
            jobs = jobs.map(job => ({
                job_id: job.job_id,
                title: job.title,
                description: job.description,
                requirements: job.requirements ? job.requirements.split('\n') : [],
                experience: job.experience,
                education: job.education,
                salary: job.salary,
                deadline: job.deadline,
                skills: job.skills ? job.skills.split(',') : [],
            }));
            if (isDatatable) {
                res.send({
                    draw,
                    recordsTotal,
                    recordsFiltered,
                    data: jobs
                });
            }
            res.json({ jobs })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = jobController;