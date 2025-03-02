const { validationResult } = require('express-validator');

function validate(validations) {
    return async function validator(req, res, next) {
        try {
            await Promise.all(validations.map(validation => validation.run(req)));
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ message: 'validation error!', data: errors.array() });
            }
            next();
        } catch (error) {
            next(error);
        }
    }
}

module.exports = validate;