const log4js = require('log4js');

log4js.configure({
    appenders: { update: { type: 'file', filename: 'update.log'}},
    categories: { default: { appenders: ['update'], level: 'info'}}
});

const logger = log4js.getLogger("Update");

function logInfo(info) {
    logger.info(info);
}

module.exports = logInfo;