const express = require("express");

const router = express.Router();

const {
  createSchedule,
  getDoctorSchedules,
} = require("../controllers/schedule.controller");

const authorizeRoles = require("../middlewares/role.middleware");
const { scheduleValidation } = require("../validators/schedule");
const validate = require("../middlewares/validate.middleware");

router.post(
  "/",
  scheduleValidation,
  validate,
  authorizeRoles("admin"),
  createSchedule,
);

router.get("/:doctorId", getDoctorSchedules);

module.exports = router;
