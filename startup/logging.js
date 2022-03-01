const { createLogger, transports, configure, format } = require("winston");

// Load Config
const { mongoURI } = require("../config/keys");

require("winston-mongodb").MongoDB;
require("express-async-errors");

// Setup winston logging transports and files
module.exports = () => {
  // Create the winston logger to handle the exceptions
  const logger = createLogger({
    transports: [
      new transports.File({
        filename: "uncaughtExceptions.log",
      }),
    ],
    exitOnError: false,
  });

  // Handle unhandled exceptions
  logger.exceptions.handle(
    new transports.File({
      filename: "exceptions.log",
    })
  );

  // Handle unhandled rejections
  logger.rejections.handle(
    new transports.File({
      filename: "rejections.log",
    })
  );

  // Load the winston module for the file
  configure({
    transports: [
      new transports.File({
        filename: "logFile.log",
        level: "error",
        format: format.combine(
          format.colorize(),
          format.simple(),
          format.json()
        ),
      }),

      // Database error logger to winston
      new transports.MongoDB({
        collection: "log",
        db: mongoURI,
        name: "error-mongodb",
        level: "info",
      }),
    ],
  });
  return;
};