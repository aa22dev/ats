const path = require('path');

module.exports = {
    host: '127.0.0.1', // dummy IP address, needs to be setup
    port: 465,
    auth: {
        user: 'dummy@aa22.dev', // dummy sender email, needs to be setup
        pass: 'dummypassword' // dummy password, needs to be setup
    },
    secure: true,
};