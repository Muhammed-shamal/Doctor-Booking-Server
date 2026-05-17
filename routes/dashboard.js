const express = require("express");
const router = express.Router();
const { getDashboardData } = require("../controllers/dashboard");

router.get("/summary", getDashboardData);

module.exports = router;
