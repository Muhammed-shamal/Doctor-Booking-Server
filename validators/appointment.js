const {
  body
} = require("express-validator");

const appointmentValidation = [
  body("scheduleId")
    .notEmpty()
    .withMessage(
      "Schedule ID required"
    ),

  body("slotId")
    .notEmpty()
    .withMessage(
      "Slot ID required"
    ),

  body("doctorId")
    .notEmpty()
    .withMessage(
      "Doctor ID required"
    )
];

module.exports = {
  appointmentValidation
};