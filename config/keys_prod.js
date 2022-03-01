// Keys used on production environment
module.exports = {
  mongoURI: process.env.MONGO_URI,
  secretOrKey: process.env.SECRET_OR_KEY,
  secretOrMailerKey: process.env.SECRET_OR_MAILER_KEY,
  mailAppEmail: process.env.MAIL_APP_EMAIL,
  mailAppPassword: process.env.MAIL_APP_PASSWORD,
  gravatarId: process.env.GRAVATAR_ID,
  sessionSecretOrKey: process.env.SESSION_SECRET_OR_KEY,
  piAuthToken: process.env.PI_AUTH_TOKEN,
  drawPasskey: process.env.DRAW_PASSKEY,
};