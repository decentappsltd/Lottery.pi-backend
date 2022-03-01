const { User } = require("../models/User_Register");
const { UserProfile } = require("../models/User_Profile");
const {
  errorStatus,
  infoStatus,
  statusCode,
} = require("../utils/reusableFunc");

// Return the current profile
const getMyProfile = async (req, res) => {
  const { _id } = req.session.user;
  try {
    const profile = await UserProfile.findOne({ user: _id });
    if (!profile) {
      const message = "There is no profile for that user";
      statusCode(res, message);
    }

    return res.json({ success: true, profile });
  } catch (error) {
    const errorMessage = `Getting current profile error ${error}`;
    infoStatus(res, errorMessage);
  }
};

// Get user profile by unique user handle
const profileByHandle = async (req, res) => {
  try {
    const profile = await UserProfile.findOne({
      handle: req.params.handle,
    }).populate("user", ["name", "avatar"]);

    if (!profile) {
      const message = "There is no user found with that handle!";
      statusCode(res, message);
    }

    return res.json({ success: true, profile });
  } catch (error) {
    const errorMessage = `Getting profile by handle error ${error}`;
    errorStatus(res, errorMessage);
  }
};

// Get user profile by user ID
const profileByUserId = async (req, res) => {
  try {
    const profile = await UserProfile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);
    if (!profile) {
      const message = "There is no profile found with that Id!";
      statusCode(res, message);
    }

    return res.json({ success: true, profile });
  } catch (error) {
    const errorMessage = `Getting profile by user ID error : ${error}`;
    errorStatus(res, errorMessage);
  }
};

// Create user profile
const createProfile = async (req, res) => {
  const { handle } = req.body;
  const { _id } = req.session.user;

  // Check and return any errors from the validation
  // const { errors, isValid } = validateProfileInput(handle);
  // if (errors) statusCode(res, errors, 400);

  // Create an object to store the inputs into
  const profileFields = {
    user: _id,
    handle,
  };

  // Update the fields if the profile is true
  try {
    const profile = await UserProfile.findOne({ user: _id });
    if (!profile) {
      // Check if the handle exists
      const handleCheck = await UserProfile.findOne({
        handle: profileFields["handle"],
      });
      if (handleCheck) {
        errors.handle = "That handle already exists";
        statusCode(res, errors);
      } else {
        // Save profile is it doesn't exists
        const saveProfile = await new UserProfile(profileFields).save();
        if (!saveProfile) {
          const message = "Unable to save new profile!";
          infoStatus(res, message);
        }

        return res.json({ success: true, profile: profileFields });
      }
    } else {
      // Update profile if found
      const updateProfile = await UserProfile.findOneAndUpdate(
        { user: _id },
        { $set: profileFields },
        { new: true }
      );
      if (!updateProfile) {
        const message = "No user found to update or create profile for!";
        infoStatus(res, message);
      }

      return res.json({ success: true, profile: profileFields });
    }
  } catch (error) {
    const errorMessage = `Creating or updating profile error ${error}`;
    errorStatus(res, errorMessage);
  }
};

// Delete current profile
const deleteAccount = async (req, res) => {
  const { _id } = req.session.user;

  try {
    // Get and remove user profile
    const profile = await UserProfile.findOneAndRemove({ user: _id });
    if (!profile) {
      const message = "Unable to find and delete profile!";
      statusCode(res, message);
    }
    // Get and remove user account
    const user = await User.findByIdAndRemove({ _id });
    if (!user) {
      const message = "Unable to find and delete user!";
      statusCode(res, message);
    }

    return res.json({ success: true, User: { profile, user } });
  } catch (error) {
    const errorMessage = `Delete Profile Error : ${error}`;
    errorStatus(res, errorMessage);
  }
};

module.exports = {
  getMyProfile,
  createProfile,
  profileByHandle,
  profileByUserId,
  deleteAccount
};