const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const express = require('express');
const winston = require('winston');
const expressWinston = require('express-winston');
const rfs = require('rotating-file-stream');

/**
 * Middleware function for enhancing security, enabling CORS, setting up logger middleware,
 * parsing JSON and URL-encoded data, and serving static files.
 *
 * @param {Object} app - The Express app object.
 * @return {void}
 */
function middleware(app) {
    const transports = [
        new winston.transports.File({ filename: path.join(__dirname, 'logs/error.log'), level: 'error' }),
        new winston.transports.File({ filename: path.join(__dirname, 'logs/combined.log') }),
    ]

    // Print logs on console in development environment
    if (process.env.NODE_ENV !== 'production') {
        app.use(morgan('combined')); 

        transports.push(
            new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple(),
            )})
        )
    }

    // Setup Express Middleware for logging all the errors and logs in files
    app.use(expressWinston.logger({
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
    }));

    // Middleware for enhanced security
    app.use(helmet());

    // Setup logger middleware
    app.use(morgan('combined', {
        stream: rfs.createStream('access.log', {
            interval: '1d', // rotate daily
            path: path.join(__dirname, 'logs')
          })
    }));

    // Body parser middleware to parse JSON and URL-encoded data
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    // Serve static files from the "public" directory
    app.use(express.static(path.join(__dirname, 'public')));
}

module.exports = middleware;