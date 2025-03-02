const moment = require('moment');

async function healthCheck() {
    return {
        status: 200,
        uptime: process.uptime(),
        response_time: process.hrtime(),
        message: 'OK',
        timestamp: moment().format()
    };
}

module.exports = healthCheck;