const ErrorHandler = require("../utils/ErrorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Interval Server Error";

  // wrong mongodb id error
  if (err.name === "Cast Error") {
    const message = `Resources not found with this id... Invalid${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  // Duplicate Key error
  if (err.code === 11000) {
    const message = `Dupicate key ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message, 400);
  }

  // wrong JWT error
  if (err.name === "JsonWebTokenError") {
    const messsage = `Your url is invalid please try again later`;
    err = new ErrorHandler(messsage, 400);
  }

  // JWT expired
  if (err.name === "TokenExpiredError") {
    const message = `Your url is expired please try again later`;
    err = new ErrorHandler(messsage, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
