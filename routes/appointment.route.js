const express = require("express");

const router = express.Router();

const {
  bookAppointment,
  getMyAppointments,
  updateAppointmentStatus,
} = require("../controllers/appointment.controller");

const authorizeRoles = require("../middlewares/role.middleware");

const validate = require("../middlewares/validate.middleware");
const { appointmentValidation } = require("../validators/appointment");

router.post(
  "/book",
  appointmentValidation,
  validate,
  authorizeRoles("patient"),
  bookAppointment,
);

router.get("/my", authorizeRoles("patient"), getMyAppointments);

router.patch("/:id/status", authorizeRoles("admin"), updateAppointmentStatus);

module.exports = router;
