const { body, validationResult } = require('express-validator');

const adValidators = [
    body('name').isString().withMessage('Name is required and should be a string.'),
    body('salary').isNumeric().withMessage('Salary is required and should be a number.'),
    body('available').isBoolean().withMessage('Available status is required and should be a boolean.'),
    body('propertyType').isString().withMessage('Property Type is required and should be refer id'),
    body('phone').isString().withMessage('Phone is required and should be a string.'),
    body('email').isEmail().withMessage('Email is required and should be a valid email format.'),
    body('Area').isString().withMessage('Area is required and should be a string.'),
    body('Bedrooms').isNumeric().withMessage('Bedrooms is required and should be a number.'),
    body('Bathrooms').isNumeric().withMessage('Bathrooms is required and should be a number.'),
    body('title').isString().withMessage('Title is required and should be a string.'),
    body('Description').isString().withMessage('Description is required and should be a string.'),
    body('Address').isString().withMessage('Address is required and should be a string.'),
    body('Payment_option').isString().withMessage('Payment Option is required and should be a string.'),
];

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = {
    adValidators,
    validate,
};
