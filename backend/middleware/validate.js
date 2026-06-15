const { validationResult } = require('express-validator');

// This middleware reads validation errors set by express-validator
// and sends them back as a clean response before the controller runs
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: 'Validation failed',
            errors: errors.array().map(e => ({ field: e.path, message: e.msg }))
        });
    }
    next();
};

module.exports = validate;