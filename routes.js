const path = require('path');
const fs = require('fs');

function routes(app) {
    // Setup & Use API Routes
    fs.readdirSync(__dirname + '/api').forEach((file) => {
        if (file.endsWith('.js')) {
            const route = require(`./api/${file}`);
            app.use(`/api/${route.path}`, route);
        }
    });

    // Setup & Use Routes
    fs.readdirSync(__dirname + '/routes').forEach((file) => {
        if (file.endsWith('.js')) {
            const route = require(`./routes/${file}`);
            app.use(route.path, route);
        }
    });

    // Setup 404 Error Handling
    app.use((req, res, next) => {
        res.status(404).send('Page not Found');
        // res.render('404');
    });

    // Setup Server Error Handling
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).send('Something went wrong!');
    });
}

module.exports = routes;