const express = require("express");

const router = express.Router();

const {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} = require("../controllers/doctor.controller");

const authorizeRoles = require("../middlewares/role.middleware");
const { doctorValidation } = require("../validators/doctor");
const validate = require("../middlewares/validate.middleware");

router.get("/", getDoctors);

router.get("/:id", getDoctorById);

router.post(
  "/",
  doctorValidation,
  validate,
  authorizeRoles("admin"),
  createDoctor,
);

router.put(
  "/:id",
  doctorValidation,
  validate,
  authorizeRoles("admin"),
  updateDoctor,
);

router.delete("/:id", authorizeRoles("admin"), deleteDoctor);

module.exports = router;
