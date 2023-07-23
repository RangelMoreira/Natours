const AppError = require("./../utils/appError");

const handlerCastErrorDB = (err) => {
  const message = `Invalid ${err.path} : ${err.value}`;
  return new AppError(message, 400);
};

const handlerDuplicateFields = (err) => {
  const value = err.errmsg.match(/(["'])(?:\\.|[^\\])*?\1/)[0];

  const message = `Duplicate field value: ${value}. Please use another value!`;

  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  //Store errors messages for each field
  const errors = Object.values(err.errors).map((el) => el.message);

  //It shows all errors in this string
  const message = `Invalid input data. ${errors.join(".  ")}`;
  return new AppError(message, 400);
};
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  //Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    //Programing or other unknown error: don't leak error details
  } else {
    //1) Log  error
    console.error("ERROR 💥 ", err);

    //2) Send generic message
    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
};

module.exports = (err, req, res, next) => {
  // console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV.trim() === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV.trim() === "production") {
    let error = Object.create(err);

    //Mongo database
    if (error.name === "ValidationError")
      error = handleValidationErrorDB(error);

    if (error.name === "CastError") error = handlerCastErrorDB(error);

    if (error.code === 11000) error = handlerDuplicateFields(error);

    sendErrorProd(error, res);
  }
};
