const { throwErr } = require('../helpers/error');
const { verifyApiKeyInDB, verifySessionTokenInDB, verifyProfileCompletionInDB } = require('../services/authUtils.js');

module.exports = {
    verifyApiKey: async (req, res, next) => {
        try {
            const apiKey = req.headers['x-api-key'];
            const origin = req.headers['origin'];

            if (!apiKey || !origin) {
                throwErr('API key is invalid', 401);
            }

            const verifier = await verifyApiKeyInDB(apiKey, origin);

            if (!verifier.isValid) {
                res.setHeader('Access-Control-Allow-Origin', '');
                throwErr('API key is invalid', 401);
            }

            res.setHeader('Access-Control-Allow-Origin', origin);
            res.header('Access-Control-Allow-Methods', '*');

            req.body.companyId = verifier.companyId;

            next();

        } catch (error) {
            next(error)
        }
    },

    verifySessionToken: async (req, res, next) => {
        try {
            const sessionToken = req.headers['authorization'];

            if (!sessionToken) {
                throwErr('Session token is invalid', 401);
            }

            const verifier = await verifySessionTokenInDB(sessionToken);

            if (!verifier.isValid) {
                throwErr('Session token is invalid', 401);
            }

            req.body.userId = verifier.userId;
            req.userId = verifier.userId;

            next();
        } catch (error) {
            next(error)
        }
    },

    verifyProfileCompletion: async (req, res, next) => {
        try {
            const { userId } = req;

            const verifier = await verifyProfileCompletionInDB(userId)

            if(!verifier.isComplete) {
                throwErr('Profile incomplete. Please complete your profile to access this resource.', 403);
            }

            req.body.applicantId = verifier.applicant_id
            req.applicantId = verifier.applicant_id

            next();
        } catch (error) {
            next(error);
        }
    }
}