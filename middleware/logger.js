const morgan = require('morgan');
const winston = require('winston');
const expressWinston = require('express-winston');
const rfs = require('rotating-file-stream');


// Create an array of winston transports
const transports = [
    // Create a new winston transport for logging errors to the error.log file
    new winston.transports.File({ filename: __basedir + '/logs/error.log', level: 'error' }),
    // Create a new winston transport for logging to the combined.log file
    new winston.transports.File({ filename: __basedir + '/logs/combined.log' })
];

const config = {
    /**
    * A function that adds a new transport to the list of transports.
    */

    dev: function () {
        // Add a new transport to the list of transports
        transports.push(
            new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.colorize(),
                    winston.format.simple(),
                )
            })
        );
    },

    /**
    * A function that returns an expressWinston logger.
    *
    * @return {object} The expressWinston logger.
    */
    expressWinston: function () {
        // Create an expressWinston logger with log level based on the response status code
        return expressWinston.logger({
            statusLevels: false,
            level: function (req, res) {
                let level = "";
                if (res.statusCode >= 100) { level = "info"; }
                if (res.statusCode >= 300) { level = "warn"; }
                if (res.statusCode >= 400) { level = "error"; }
                return level;
            },
            transports,
            format: winston.format.json(),
            meta: true,
            msg: 'HTTP {{req.method}} {{req.url}}',
            expressFormat: true,
            colorize: true,
            dynamicMeta: function (req, res) {
                err = res.locals.error
                return (res.locals && err) ? { error: { message: err.message, stack: err.stack } } : {}
            }
        });
    },

    /**
    * Returns a morgan logger with a combined format, writing to an access log file that rotates daily.
    *
    * @return {Object} A morgan logger object
    */
    logger: function () {
        // Create a morgan logger with combined format
        return morgan('combined', {
            // Write log to access.log file that rotates daily
            stream: rfs.createStream('access.log', {
                interval: '1d', // rotate daily
                path: __basedir + '/logs'
            })
        })
    }
}

module.exports = {
    /**
    * A Function to setup the logger middleware.
    */
    init: function () {
        if (process.env.NODE_ENV !== 'production') {
            app.use(morgan('combined'));
            config.dev();
        }

        app.use(config.expressWinston());
        app.use(config.logger());
    }
}