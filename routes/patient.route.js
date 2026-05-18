const express = require("express");
const { getPatients } = require("../controllers/patient.controller");
const authorizeRoles = require("../middlewares/role.middleware");
const router = express.Router();

router.get("/", authorizeRoles("admin"), getPatients);

module.exports = router;
