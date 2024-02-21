module.exports = {
    /**
    * Handles errors from the API.
    *
    * @param {error} err - the error object
    * @param {object} req - the request object
    * @param {object} res - the response object
    * @param {function} next - the next function
    * @return {object} JSON object containing the error message
    */
    apiErrorHandler: (err, req, res, next) => {
        res.locals.error = err;
        res.status(err.statusCode || 500).json({ error: err.message });
    },
    /**
    * Handles 404 errors for API endpoints.
    *
    * @param {object} req - the request object
    * @param {object} res - the response object
    * @param {function} next - the next function in the middleware chain
    * @return {object} JSON object with an error message
    */
    api404ErrorHandler: (req, res, next) => {
        res.status(404).json({ error: 'API Endpoint Not Found' });
    }
}