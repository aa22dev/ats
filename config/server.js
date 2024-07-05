const path = require('path');

module.exports = {
    port: 3000,
    views: path.join(__basedir, 'views'),
    viewEngine: 'pug',
    statics: path.join(__basedir, 'public'),
};