const HttpError = require('http-errors');
const Request = require('../../models/request');

async function getRequestStatus(requestId) {
    const request = await Request.findById(requestId).lean();
    if (!request) throw new HttpError[404]('request not found with provided id!');

    return { status: request.status };
};

module.exports = getRequestStatus;
