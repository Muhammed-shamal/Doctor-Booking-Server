const express = require("express");

const router = express.Router();

const {
  createSchedule,
  getDoctorSchedules
} = require(
  "../controllers/schedule.controller"
);

const authorizeRoles = require(
  "../middlewares/role.middleware"
);

router.post(
  "/",  
  authorizeRoles("admin"),
  createSchedule
);

router.get(
  "/:doctorId",
  getDoctorSchedules
);

module.exports = router;