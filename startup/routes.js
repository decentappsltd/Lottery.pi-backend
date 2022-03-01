const express = require("express");
const error = require("../middleware/error");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");

// Load routes
const profile = require("../routes/user_profile_route");
const register = require("../routes/user_register_route");
const logout = require("../routes/user_logout_route");
const payment = require("../routes/pi_payment_route");
const play = require("../routes/user_play_route");
const login = require("../routes/user_login_route");

// Load mailer and model
const { sessionSecretOrKey, mongoURI } = require("../config/keys");

module.exports = (app) => {
  // Database options
  const options = {
    mongoUrl: mongoURI,
    collection: "pilotterySession",
    // crypto: {
    //   secret: "squirrel",
    // },
  };

  // Session options
  let sess = {
    key: "userSession",
    secret: sessionSecretOrKey,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create(options),
    cookie: {
      expires: 60 * 60 * 24 * 1000 * 365,
    },
  };

  const corsOrigin = {
    origin: ["http://127.0.0.1:5500"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  };

  // Configuration in production
  app.set("trust proxy", 1);
  sess.cookie.secure = true;
  const whitelist = [
    "https://www.pi-lottery.co.uk",
    "https://www.server.pi-lottery.co.uk",
    "https://000676257.codepen.website",
  ];
  corsOrigin.origin = function (origin, callback) {
    if (whitelist.indexOf(origin) !== 1) callback(null, true);
    else callback(new Error("Not allowed by CORS!!!"));
  };
  // sess.cookie.expires: 60 * 60 * 24 * 1000 * 7,
  

  // Add middleware
  app.use(express.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cors(corsOrigin));
  app.use(session(sess));
  app.use(cookieParser());

  // Routes
  app.use("/profile", profile);
  app.use("/register", register);
  app.use("/logout", logout);
  app.use("/login", login);
  app.use("/payment", payment);
  app.use("/play", play);

  // Express Error handling middleware
  app.use(error);
};