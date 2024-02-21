const fs = require('fs');
const cors = require('cors');
const apiChecker = require('./middleware/apiChecker')
const { apiErrorHandler, api404ErrorHandler } = require('./middleware/errorHandler')

/**
* Setup & Use API Routes
*/
function apiRoutes() {
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
}

/**
* Setup & Use Routes, Setup 404 Error Handling, and Setup 500 Error Handling
*/
function regularRoutes() {
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
        // res.status(404).render('404');
    });

    app.use((err, req, res, next) => {
        res.status(500).send('Something Went Wrong!');
        // res.status(500).render('404');
    });
}

module.exports = {
    /**
    * Sets up and uses API and regular routes, handles 404 and server errors.
    *
    * @return {void} This function does not return a value.
    */
    init: function () {
        try {
            apiRoutes()
            regularRoutes()
        } catch (err) {
            console.error(`Error in routes initialization: ${err}`);
        }
    }
};