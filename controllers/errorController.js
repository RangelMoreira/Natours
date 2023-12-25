const AppError = require('./../utils/appError');

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
  const message = `Invalid input data. ${errors.join('.  ')}`;
  return new AppError(message, 400);
};

// => have an implicit return
const handleJWTErrorDB = () =>
  new AppError('Invalid token. Please login again!', 401); //Only for production

const handleJWTExpiredError = () =>
  new AppError('Invalid token. Please login again!', 401); //Only for production

const sendErrorDev = (err, req, res) => {
  //API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  // REDERED WEBSITE
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  //A) API
  if (req.originalUrl.startsWith('/api')) {
    // A) Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    //B) Programing or other unknown error: don't leak error details
    //1) Log  error
    console.error('ERROR 💥 ', err);

    //2) Send generic message
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });

    //Operational, trusted error: send message to client
  }
  // B) REDERED WEBSITE
  if (err.isOperational) {
    console.log(err);
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message,
    });
  }
  //B) Programing or other unknown error: don't leak error details
  //1) Log  error
  console.error('ERROR 💥 ', err);

  //2) Send generic message
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: 'Please try again later',
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV.trim() === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV.trim() === 'production') {
    let error = Object.create(err);

    //Mongo database
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);

    if (error.name === 'CastError') error = handlerCastErrorDB(error);

    if (error.code === 11000) error = handlerDuplicateFields(error);

    if (error.name === 'JsonWebTokenError') error = handleJWTErrorDB();

    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(err, req, res);
  }
};
