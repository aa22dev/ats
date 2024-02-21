// store the base directory in the global variable
global.__basedir = __dirname;

// Load required packages and files
const express = require('express');
const path = require('path');
const middlewares = require('./middlewares');
const routes = require('./routes');

// store reference to app globally
global.app = express();

// Setup view engine to PugJS
app.set('views', path.join(__basedir, 'views'));
app.set('view engine', 'pug');

// Initializing Middlewares
middlewares.init();

// Initializing Routes
routes.init()

// Start the server
const PORT = 3000;

// Define and run server function
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
