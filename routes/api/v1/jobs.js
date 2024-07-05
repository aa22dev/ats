const router = require('express').Router();
const jobs = require('../../../controllers/jobs.js');

router.get('/', jobs.get);

module.exports = {
    router,
    path: '/api/v1/jobs',
}