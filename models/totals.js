const Joi = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Post Schema
const TotalsSchema = new Schema({
  thisWeek: {
    type: Number,
    default: 0,
  },
  all: {
    type: Number,
    default: 0,
    required: true,
  },
  charity: {
    type: Number,
    default: 0,
  },
  lastWinner: {
    type: String,
  }
});

// Create Post Model in the database
const Totals = mongoose.model("total" ,TotalsSchema);

module.exports = { Totals };