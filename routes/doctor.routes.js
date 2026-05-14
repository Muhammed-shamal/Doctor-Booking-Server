const express = require("express");

const router = express.Router();

const {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor
} = require("../controllers/doctor.controller");

const authorizeRoles = require(
  "../middlewares/role.middleware"
);

router.get("/", getDoctors);

router.get("/:id", getDoctorById);

router.post(
  "/",
  authorizeRoles("admin"),
  createDoctor
);

router.put(
  "/:id",
  authorizeRoles("admin"),
  updateDoctor
);

router.delete(
  "/:id",
  authorizeRoles("admin"),
  deleteDoctor
);

module.exports = router;