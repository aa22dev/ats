const morgan = require('morgan');
const winston = require('winston');
const expressWinston = require('express-winston');
const rfs = require('rotating-file-stream');
require('winston-daily-rotate-file');

const logDir = `${__basedir}/logs`;

function createStream(file) {
    function getDate(time) {
        if (!time) return file;
        time.setDate(time.getDate() - 1);
        return `${time.toISOString().split('T')[0]}-${file}.gz`;
    }

    return rfs.createStream(getDate, {
        interval: '1d',
        path: logDir,
        compress: 'gzip'
    });
}

const transports = [
    new winston.transports.DailyRotateFile({
        stream: createStream('error.log'),
        level: 'error'
    }),
    new winston.transports.DailyRotateFile({
        stream: createStream('combined.log'),
    })
];


if (process.env.NODE_ENV !== 'production') {
    transports.push(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.json({
                    space: 4
                }),
                winston.format.colorize({
                     all: true
                }),
            )
        })
    );
}

const expressLogger = expressWinston.logger({
    statusLevels: false,
    level: function (req, res) {
        const statusCode = res.statusCode;
        return statusCode >= 400 ? 'error'
            : statusCode >= 300 ? 'warn'
            : 'info';
    },
    transports,
    format: winston.format.json(),
    meta: true,
    expressFormat: true,
    dynamicMeta: function (req, res) {
        err = res.locals.error
        return (res.locals && err) ? { error: { message: err.message, stack: err.stack } } : {}
    }
});

const accessLogger = morgan('combined', {
    stream: createStream('access.log')
});

module.exports = {
    expressLogger,
    accessLogger
}