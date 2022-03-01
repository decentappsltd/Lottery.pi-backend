const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");

// Create Profile Schema
const UserProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  handle: {
    type: String,
    required: true,
    min: 3,
    max: 20,
    trim: true,
    unique: true,
  },
  winnings: {
    type: Number,
    default: 0,
  },
  won: {
    type: Boolean,
    default: false,
  },
  dateAdded: {
    type: Date,
    default: Date.now,
  },
  dateUpdated: {
    type: Date,
    default: Date.now,
  },
  dateRemoved: {
    type: Date,
  },
});

// Create Profile Model in the database
const UserProfile = mongoose.model("profile", UserProfileSchema);

// Validate user input
const validateProfile = (user) => {
  const schema = Joi.object({
    handle: Joi.string().min(3).max(20).required(),
  });

  return schema.validate(user);
};

module.exports = { UserProfile, validateProfile }; 
