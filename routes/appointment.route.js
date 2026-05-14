const express = require("express");

const router = express.Router();

const {
  bookAppointment,
  getMyAppointments,
  updateAppointmentStatus
} = require(
  "../controllers/appointment.controller"
);

const authorizeRoles = require(
  "../middlewares/role.middleware"
);

router.post(
  "/book",
  authorizeRoles("patient"),
  bookAppointment
);

router.get(
  "/my",
  authorizeRoles("patient"),
  getMyAppointments
);

router.patch(
  "/:id/status",
  authorizeRoles("admin"),
  updateAppointmentStatus
);

module.exports = router;