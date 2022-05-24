const { compare } = require("bcrypt");

// Load utils and model
const { errorStatus, statusCode } = require("../utils/reusableFunc");
const { validateLogin, User } = require("../models/User_Register");
const { UserProfile } = require("../models/User_Profile");

// Login a user
const login = async (req, res) => {
  const { username, password: userPassword, uid } = req.body;

  // Validate the user credentials
  const { error } = validateLogin(req.body);
  if (error) {
    const message = error.details[0].message;
    statusCode(res, message, 400);
  } else {
    // Find and validate user credentials
    // return error if account is not verified or found
    try {
      let user = await User.findOne({ username });
      const message = "Invalid Username or password";
      if (!user) statusCode(res, message, 400);
      else {
        // Compare and validate user input with stored credential
        const validatePassword = await compare(userPassword, user.password);
        if (!validatePassword) statusCode(res, message, 400);

        // Generate and implement a new jsonwebtoken
        const token = await user.generateAuthToken();
        console.log(req.body);
        if (uid) {
          const addedUID = await User.findOneAndUpdate({ username: username }, { uid: uid }, { new: true });
        }

        // Remove password and store user to session
        delete user["password"];
        req.session.user = user;

        return res
          .header("Authorization", token)
          .json({ success: true, token });
      }
    } catch (error) {
      const errorMessage = `Login error : ${error}`;
      errorStatus(res, errorMessage);
    }
  }
};

// login using UID from Pi.athenticate in the Pi Browser
const piLogin = async (req, res) => {
  const username = req.body.username;
  const uid = req.body.uid;
  let user = await User.findOne({ username: username, uid: uid });
  if (user) {

    // Generate and implement a new jsonwebtoken
    const token = await user.generateAuthToken();

    // Store user to session
    req.session.user = user;

    return res
      .status(200)
      .header("Authorization", token)
      .json({ success: true, token });

  } else {
    // Create a new user after basic validation checks
    try {
      const createUser = req.body;
      user = new User(createUser);

      // Save the database
      await user.save();

      const profileFields = {
        user: user._id,
        handle: username,
      };
      const handleCheck = await UserProfile.findOne({
        handle: profileFields["handle"],
      });
      if (handleCheck) {
        console.log("That handle already exists");
      } else {
        await new UserProfile(profileFields).save()
      }

      // Generate and implement a new jsonwebtoken
      const token = await user.generateAuthToken();

      // Store user to session
      req.session.user = user;

      return res
        .status(201)
        .header("Authorization", token)
        .json({ success: true, token });

    } catch (error) {
      const errorMessage = `User registration error: ${error}`;
      errorStatus(res, errorMessage);
    }
  }
};

module.exports = { login, piLogin };