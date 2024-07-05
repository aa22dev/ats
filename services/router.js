const fs = require('fs');
const path = require('path');

function load(directory=`${__basedir}/routes`) {
    try {
        fs.readdirSync(directory).forEach((file) => {
            const filePath = path.join(directory, file);
            if (fs.statSync(filePath).isDirectory()) {
                load(filePath);
            } else if (file.endsWith('.js') && directory !== `${__basedir}/routes`) {
                const route = require(filePath);
                app.use(route.path, route.router);
                console.log(`Route ${route.path} loaded from ${filePath}`);
            }
        });
    } catch (err) {
        throwErr(`Unable to discover routes: ${err}`, 500);
    }
}

module.exports = load;
