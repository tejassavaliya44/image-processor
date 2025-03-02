const { param, body } = require('express-validator');

module.exports = {
    requestIdValidation: [
        param('requestId').isMongoId().withMessage('Invalid requestId parameter!'),
    ]
}