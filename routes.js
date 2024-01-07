const path = require('path');
const fs = require('fs');
const cors = require('cors');
const apiChecker = require('./middleware/apiChecker')
const { apiErrorHandler, api404ErrorHandler } = require('./middleware/errorHandler')

/**
 * Sets up and uses API and regular routes, handles 404 and server errors.
 *
 * @param {object} app - The Express app object.
 * @return {undefined} This function does not return a value.
 */
function routes(app) {
    // Setup & Use API Routes
    fs.readdirSync(__dirname + '/api').forEach((file) => {
        if (file.endsWith('.js')) {
            const route = require(`./api/${file}`);
            app.use(route.path, cors(apiChecker.check), route.router);
        }
    });

    // Setup API 404 Error Handling
    app.use('/api', api404ErrorHandler);

    // Setup API Server Error Handling
    app.use('/api', apiErrorHandler);

    // Setup & Use Routes
    fs.readdirSync(__dirname + '/routes').forEach((file) => {
        if (file.endsWith('.js')) {
            const route = require(`./routes/${file}`);
            app.use(route.path, cors(), route);
        }
    });

    // Setup 404 Error Handling
    app.use((req, res, next) => {
        res.status(404).send('Page not Found');
        // res.render('404');
    });

    app.use((err, req, res, next) => {
        res.status(500).send('Something Went Wrong!');
        // res.render('404');
    });
}

module.exports = routes;