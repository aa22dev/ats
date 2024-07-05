const router = require('express').Router();
const applicant = require('../../../controllers/applicant.js');
const profile = require('../../../controllers/profile.js');
const resume = require('../../../controllers/resume.js');
const { verifySessionToken, verifyProfileCompletion } = require('../../../middleware/auth.js');
const psychometric = require('../../../controllers/psychometricTest.js');
const application = require('../../../controllers/application.js');

router.post('/login', applicant.login);
router.post('/register', applicant.register);
router.post('/verifyotp', applicant.verifyOtp);
router.post('/sessiontoken/validate', applicant.validateSessionToken)

router.use(verifySessionToken);

router.get('/profile/status', applicant.profileStatus)
router.post('/upload/resume', resume.uploadResume, resume.parseFill);

router.use(verifyProfileCompletion);

router.get('/', applicant.details);
router.get('/profile', applicant.profile);
router.put('/profile', applicant.updateProfile);
router.put('/profile/picture', profile.uploadProfile, profile.updateDp)
router.get('/job/recommendations', applicant.recommendJobs)
router.get('/test/psychometric/:id', psychometric.getTest)
router.post('/test/psychometric/submit', psychometric.submitResponse);
router.get('/test/psychometric/results/:testId', psychometric.getTestResults);
router.post('/apply/:jobId', application.apply);
router.get('/applications', application.getByApplicant);
router.get('/applications/:jobId', application.getByJob);

module.exports = {
    router,
    path: '/api/v1/applicant',
}