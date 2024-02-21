const path = require('path');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const express = require('express');
const logger = require('./middleware/logger');

module.exports = {
    /**
     * Initialize middleware for the application, including logger, security, body parsing, and serving static files.
     *
     * @return {void} - No return value
     */
    init: function () {
        try {
            // Initialize logger middleware
            logger.init();

            // Enhance security with helmet middleware
            app.use(helmet());

            // Body parser middleware to parse JSON and URL-encoded data
            app.use(bodyParser.json());
            app.use(bodyParser.urlencoded({ extended: true }));

            // Serve static files from the "public" directory
            app.use(express.static(path.join(__dirname, 'public')));
        } catch (err) {
            console.error(`Error in middleware initialization: ${err}`);
        }
    }
}