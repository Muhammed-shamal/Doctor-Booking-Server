const errorMiddleware = (
  err,
  req,
  res,
  next
) => {
  let statusCode =
    err.statusCode || 500;

  let message =
    err.message ||
    "Internal Server Error";

  /*
    mongoose bad object id
  */

  if (err.name === "CastError") {
    message =
      "Resource not found";

    statusCode = 404;
  }

  /*
    duplicate key error
  */

  if (err.code === 11000) {
    message =
      "Duplicate field value";

    statusCode = 400;
  }

  res.status(statusCode).json({
    success: false,
    message,

    stack:
      process.env.NODE_ENV ===
      "development"
        ? err.stack
        : undefined
  });
};

module.exports =
  errorMiddleware;