/** @format */

require("dotenv").config();
const mongoose = require("mongoose");

const URI = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(URI);
    console.log("DB Connected");
  } catch (error) {
    console.log(error);
  }
};
module.exports = connectDB;
