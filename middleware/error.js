const { errorStatus } = require("../utils/reusableFunc");

module.exports = function (error, req, res, next) {
  const message = `Error middleware error message from ${req.originalUrl}. ${error}`;
  errorStatus(res, message);
};