const {
  validationResult
} = require("express-validator");

const validate = (req, res, next) => {
  const errors =
    validationResult(req);

  if (!errors.isEmpty()) {
    console.log('validation error',errors)
    return res.status(400).json({
      success: false,
      message:
        "Validation failed",

      errors: errors.array()
    });
  }

  next();
};

module.exports = validate;