const swaggerJsDoc = require("swagger-jsdoc");

const tags = require("./docs/tags");

const authSchemas = require("./docs/schemas/auth");
const doctorSchemas = require("./docs/schemas/doctor");
const scheduleSchemas = require("./docs/schemas/schedule");
const appointmentSchemas = require("./docs/schemas/appointment");

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Doctor Booking API",
      version: "1.0.0",
      description: "Doctor Appointment Booking System API",
    },

    servers: [
      {
        url: "http://localhost:5000/api-docs",
        description: "Development Server",
      },
    ],

    tags,

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },

      schemas: {
        ...authSchemas,
        ...doctorSchemas,
        ...scheduleSchemas,
        ...appointmentSchemas,
      },
    },
  },

  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;
