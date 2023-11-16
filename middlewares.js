const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const express = require('express');

function middleware(app) {
    // Middleware for enhanced security
    app.use(helmet());

    // Enable CORS for all routes
    app.use(cors());

    // Setup logger middleware
    app.use(morgan('combined'));

    // Body parser middleware to parse JSON and URL-encoded data
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    // Serve static files from the "public" directory
    app.use(express.static(path.join(__dirname, 'public')));
}

module.exports = middleware;