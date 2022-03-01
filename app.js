const express = require("express");
const app = express();
const { info: winstonInfo, error: winstonError } = require("winston");
const port = process.env.PORT || 5000;

// Import the separated winston logger
require("./startup/logging")();

// Import the separated routes middleware
require("./startup/routes")(app);

// Import the separated database initialization
require("./startup/dbInit")();

// Import the separated config checker
require("./startup/config")();

// Import the separated Joi validation
require("./startup/joiValidation")();

// Import the production module from the prod file
if (app.get("env") === "production") require("./startup/prod")(app);

// Listen to app port
let server;
try {
  server = app.listen(port, () => {
    const message = `Server is listening on port ${port}`;
    console.log(message);
    winstonInfo(message);
  });
} catch (error) {
  const message = `Unable to connect to server error : ${error}`;
  console.log(message);
  winstonError(message);
}

module.exports = server;
