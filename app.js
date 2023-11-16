const express = require('express');
const path = require('path');
const middlewares = require('./middlewares');
const routes = require('./routes');

const app = express();

// Setup view engine to PugJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Initializing Middlewares
middlewares(app);

// Initializing Routes
routes(app)

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
