require("dotenv").config();
const mongoose = require("mongoose");

const URI = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(URI);
  } catch (error) {
    console.log(error);
  }
};
module.exports = connectDB;
