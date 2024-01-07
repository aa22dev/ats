module.exports = {
    apiErrorHandler: (err, req, res, next) => {
        res.locals.error = err;
        console.error(err);
        res.status(err.statusCode || 500).json({ error: err.message });
    },
    api404ErrorHandler: (req, res, next) => {
        res.status(404).json({ error: 'API Endpoint Not Found' });
    }
}