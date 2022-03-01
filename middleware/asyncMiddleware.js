// Removing and Improving the try and catch block in the routes
const asyncMiddleware = (handler) => {
  return async (req, res, next) => {
    try {
      await handler(req, res);
    } catch (error) {
      next(error);
    }
  };
};

module.exports = asyncMiddleware;