const { throwErr } = require('../utils/error')

async function getOrigin(api) {
    // search for api
    // fetch allowed domains against that api
    if (api !== 'testapikey') {
        throwErr("Invalid API Key", 403);
    }
    return (api === 'testapikey') ? ['http://localhost'] : ['http://apidomain.tld']
}


module.exports = {
    async check(req, callback) {
        try {
            const corsOptions = {};

            const allowedOrigins = await getOrigin(req.headers['x-api-key']);

            if (allowedOrigins.includes(req.headers.origin)) {
                corsOptions.origin = true;
            } else {
                throwErr("Origin does not match the API Key", 403);
            }
            callback(null, corsOptions);
        } catch (err) {
            callback(err);
        }
    }
}