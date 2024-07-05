// const db = require('../config/db');

const { getApiKey } = require('../models/api_keys.js');
const { getAllowedOrigin } = require('../models/allowed_origins.js');
const { getSessionByToken } = require('../models/sessions.js');

module.exports = {
    verifyApiKeyInDB: async (apiKey, origin) => {
        const results = await getApiKey(apiKey);
        if (results) {
            const allowedOrigin = await getAllowedOrigin(results['api_key_id']);
            if (allowedOrigin) {
                if (allowedOrigin['origin_url'] === origin) {
                    return {
                        isValid: true,
                        companyId: results['company_id']
                    };
                }
            }
        } 
        
        return {
            isValid: false,
            companyId: null
        };
    },
    verifySessionTokenInDB: async (token) => {
        sessions = await getSessionByToken(token);
        if (sessions) {
            return {
                isValid: true,
                userId: sessions['user_id']
            };
        }

        return {
            isValid: false,
            userId: null
        };
    },

    verifyProfileCompletionInDB: async (userId) => {
        const { getProfile } = require('../models/applicants.js');
        const { getEducationByApplicantId } = require('../models/applicants.js').education;
        const applicant = await getProfile(userId);
        const education = await getEducationByApplicantId(applicant ? applicant.applicant_id : 0);
        if (!applicant || !education.length) {
            return { isComplete: false, applicant_id: null };
        }
        return { isComplete: true, applicant_id: applicant.applicant_id };
    }
};
