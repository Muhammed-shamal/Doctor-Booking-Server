const { body } = require("express-validator");

const doctorValidation = [
  body("fname").notEmpty().withMessage("Doctor first name required"),
  body("phone").isMobilePhone().withMessage("Invalid phone number"),

  body("specialization").notEmpty().withMessage("Specialization required"),

  body("experience").isNumeric().withMessage("Experience must be number"),
  body("qualifications").notEmpty().withMessage("Qualifications is required"),

  body("consultationFee")
    .isNumeric()
    .withMessage("Consultation fee must be number"),

  body("clinic_name").notEmpty().withMessage("Clinic name is required"),
  body("clinic_address").notEmpty().withMessage("Clinic address is required"),
];

module.exports = {
  doctorValidation,
};
