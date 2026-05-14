const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const { corsOptions } = require("./config/common");

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use(cors(corsOptions.normal));

app.use(helmet());

app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Doctor Booking API Running",
  });
});

module.exports = app;
