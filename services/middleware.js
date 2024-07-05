const helmet = require('helmet');
const bodyParser = require('body-parser');
const logger = require('../config/logger.js');
const cookieParser = require('cookie-parser');

module.exports = () => {
    try {
        // Initialize logger middleware
        app.use(logger.expressLogger);
        app.use(logger.accessLogger);

        // Enhance security with helmet middleware
        app.use(helmet());

        // Cookie Parser Middleware
        app.use(cookieParser());

        // Body parser middleware to parse JSON and URL-encoded data
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
    } catch (err) {
        console.error(`Error in middleware initialization: ${err}`);
    }
}