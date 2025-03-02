const HttpError = require('http-errors');
const Request = require('../../models/request');

async function getRequestData(requestId) {
    const request = await Request.findById(requestId).populate({
        path: 'products',
        select: ['-created_at', '-updated_at', '-__v'],
        populate: [{
            path: 'product_images',
            select: ['-created_at', '-updated_at', '-__v']
        }]
    }).select(['-created_at', '-updated_at', '-__v']).lean();
    if (!request) throw new HttpError[404]('request not found with provided id!');

    return request;
};

module.exports = getRequestData;
