const router = require('express').Router();
const company = require('../../../controllers/company.js');

router.get('/', company.get);
router.put('/', company.update);

module.exports = {
    router,
    path: '/api/v1/company',
}