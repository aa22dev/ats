// Load required packages and files
require('./config/globals.js');
const config = require('./config/server.js');
const middlewares = require('./services/middleware.js');
const errorHandler = require('./middleware/errorHandler.js');
const router = require('./services/router.js');
const { static: statics } = require('express')
const { verifyApiKey } = require('./middleware/auth.js');

// Setup view engine to PugJS
app.set('views', config.views);
app.set('view engine', config.viewEngine);

// Serve static files from the "public" directory
app.use(statics(config.statics));

// Initializing Basic Middlewares
middlewares();

// Setting up API Key validation
app.use('/api', verifyApiKey);

// Initializing Routes
router();

// Setting up API Error Handlers
app.use('/api', errorHandler.apiErrorHandler);
app.use('/api', errorHandler.api404ErrorHandler);

// Define and run server function
app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
