const mongoose = require("mongoose");
const { info: winstonInfo } = require("winston");
const { mongoURI } = require("../config/keys");

// Connect application to database using mongoose
module.exports = async () => {
  // Catch and terminate the unconnected process
  try {
    const connection = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    if (connection)
      console.log(`Database connected successfully to : ${mongoURI}. . . `);
  } catch (error) {
    const message = `Database Connection Error :  ${error}`;
    winstonInfo(message);
    console.log(message);
  }
  return;
};