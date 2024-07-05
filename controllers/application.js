const Application = require('../models/applications');
const validate = require('../helpers/validateData');

const applicationController = {
    apply: async (req, res, next) => {
        try {
            const { applicantId } = req.body;
            const { jobId } = req.params;

            validate.id.validate(jobId);
            
            const status = 'applied';

            const existingApplications = await Application.getByApplicantId(applicantId);
            const alreadyApplied = existingApplications.some(app => app.job_id === parseInt(jobId));

            if (alreadyApplied) {
                throwErr('You have already applied for this job', 400);
            }

            const applicationId = await Application.create({ job_id: jobId, applicant_id: applicantId, status });
            res.status(201).json({ message: 'Application submitted successfully', applicationId });
        } catch (error) {
            next(error);
        }
    },
    getByApplicant: async (req, res, next) => {
        try {
            const { applicantId } = req.body;
            const applications = await Application.getByApplicantId(applicantId);
            res.status(200).json(applications);
        } catch (error) {
            next(error);
        }
    },
    getByJob: async (req, res, next) => {
        try {
            const { jobId } = req.params;
            const applications = await Application.getByJobId(jobId);
            res.status(200).json(applications);
        } catch (error) {
            next(error);
        }
    },
    updateStatus: async (req, res, next) => {
        try {
            const { applicationId, status } = req.body;
            await Application.updateStatus(applicationId, status);
            res.status(200).json({ message: 'Application status updated successfully' });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = applicationController;
