const errorHandler = (err, req, res, next) => {
  let code = 500;
  let msg = "Internal server error";

  if (err.name === "SequelizeValidationError") {
    code = 400;
    msg = err.errors[0].message;
  } else if (err.name === "SequelizeUniqueConstraintError") {
    code = 400;
    msg = err.errors[0].message;
  } else if (err.name === "InvalidInput") {
    code = 401;
    msg = "Invalid email/password";
  } else if (err.name === "JsonWebTokenError") {
    code = 401;
    msg = "Unauthorized";
  } else if (err.name === "Forbidden") {
    code = 403;
    msg = "You're not authorized";
  } else if (err.name === "UserNotFound") {
    code = 404;
    msg = "User Not Found";
  } else if (err.name === "LeaveNotFound") {
    code = 404;
    msg = "Leave Not Found";
  } else if (err.name === "Exceeding") {
    code = 404;
    msg = "Exceeding the leave"
  } else if (err.name === "BadRequest") {
    code = 404;
    msg = "Can't delte your own data"
  }

  res.status(code).json({ message: msg });
};

module.exports = errorHandler;
