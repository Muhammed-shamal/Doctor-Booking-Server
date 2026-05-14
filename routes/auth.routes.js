const express = require("express");

const router = express.Router();

const {
  register,
  login,
  logout,
  me,
} = require("../controllers/auth.controller");

const protect = require("../middlewares/auth.middleware");
const { registerValidation, loginValidation } = require("../validators/auth");
const validate = require("../middlewares/validate.middleware");
const { authLimiter } = require("../middlewares/rateLimit.middleware");

router.post("/register", registerValidation, validate, register);

router.post("/login", authLimiter, loginValidation, validate, login);

router.post("/logout", logout);

router.get("/me", protect, me);

module.exports = router;
