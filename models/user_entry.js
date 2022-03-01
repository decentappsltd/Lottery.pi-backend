const Joi = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Post Schema
const EntrySchema = new Schema({
  user: {
    type: String,
    required: true,
  },
});

// Create Post Model in the database
const Enter = mongoose.model("entries", EntrySchema);

module.exports = { Enter };