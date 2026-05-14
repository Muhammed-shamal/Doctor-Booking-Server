const {
  body
} = require("express-validator");

const scheduleValidation = [
  body("doctor")
    .notEmpty()
    .withMessage(
      "Doctor ID required"
    ),

  body("date")
    .notEmpty()
    .withMessage(
      "Date required"
    ),

  body("startTime")
    .notEmpty()
    .withMessage(
      "Start time required"
    ),

  body("endTime")
    .notEmpty()
    .withMessage(
      "End time required"
    ),

  body("slotDuration")
    .isNumeric()
    .withMessage(
      "Slot duration must be number"
    )
];

module.exports = {
  scheduleValidation
};