const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const mongoose = require("mongoose");
const swaggerUi = require("swagger-ui-express");

const { corsOptions } = require("./config/common");
const protect = require("./middlewares/auth.middleware");
const errorMiddleware = require("./middlewares/error.middleware");
const swaggerSpec = require("./swagger");

const app = express();

app.use(cors(corsOptions.normal));

app.use(express.json());

app.use(cookieParser());

app.use(helmet());

app.use(morgan("dev"));

//swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Doctor Booking API Running",
  });
});

app.get("/db/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    mongodb:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// Routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/doctors", protect, require("./routes/doctor.routes"));
app.use("/api/schedules", protect, require("./routes/schedule.routes"));
// app.use("/api/patients", require("./routes/patient.routes"));
app.use("/api/appointments", protect, require("./routes/appointment.route"));
app.use("/api/dashboard", protect, require("./routes/dashboard"));

// Catch-all for undefined routes (optional)
app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `Route ${req.originalUrl} not found`,
  });
});

app.use(errorMiddleware);

// for multer error handling
// app.use((error, req, res, next) => {
//     if (error instanceof multer.MulterError) {
//         if (error.code === 'LIMIT_FILE_SIZE') {
//             return res.status(413).json({
//                 error: 'File too large',
//                 message: 'The uploaded file exceeds the size limit'
//             });
//         }
//     }

//     if (error.type === 'entity.too.large') {
//         return res.status(413).json({
//             error: 'Request too large',
//             message: 'The request payload is too large'
//         });
//     }

//     next(error);
// });

// app.use(errorHandler);

module.exports = app;
