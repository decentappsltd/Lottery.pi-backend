const Joi = require("joi");

// Set up joi validation
module.exports = () => {
  Joi.objectId = require("joi-objectid")(Joi);
};