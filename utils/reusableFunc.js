const { error: winstonError, info: winstonInfo } = require("winston");

// Reusable functions
const errorStatus = (res, message, statusCode = 500) => {
  winstonError(res, message);
  return res.status(statusCode).json({
    success: false,
    message,
  });
};

const infoStatus = (res, message, statusCode = 500) => {
  winstonInfo(res, message);
  return res.status(statusCode).json({
    success: false,
    message,
  });
};

const statusCode = (res, message, statusCode = 404, success = false) => {
  return res.status(statusCode).json({ success, message });
};

module.exports = { errorStatus, infoStatus, statusCode };