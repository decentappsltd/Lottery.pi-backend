const helmet = require("helmet");
const compression = require("compression");

// Initialize packages in production
module.exports = (app) => {
  app.use(helmet());
  app.use(compression());
};