const {
  body
} = require("express-validator");

const doctorValidation = [
  body("name")
    .notEmpty()
    .withMessage(
      "Doctor name required"
    ),

  body("specialization")
    .notEmpty()
    .withMessage(
      "Specialization required"
    ),

  body("experience")
    .isNumeric()
    .withMessage(
      "Experience must be number"
    ),

  body("consultationFee")
    .isNumeric()
    .withMessage(
      "Consultation fee must be number"
    )
];

module.exports = {
  doctorValidation
};