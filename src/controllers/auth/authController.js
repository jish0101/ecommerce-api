/** @format */

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../../models/User");
// const mongoose = require("mongoose");

const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    const savedUser = await user.save();

    res
      .status(201)
      .json({ status: true, message: `User is created!`, data: savedUser });
  } catch (error) {
    console.log(error);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ status: false, message: "Email and Password are mandatory!" });
    }
    const foundUser = await User.findOne({ email });

    if (!foundUser) {
      return res.status(401).json({ status: false, message: "No user found!" });
    }

    const match = await bcrypt.compare(password, foundUser.password);

    if (match === true) {
      const accessToken = createToken({
        data: {
          email: foundUser?.email,
          roles: foundUser?.role,
          name: foundUser?.name,
        },
        type: 1,
      });

      const refreshToken = createToken({
        data: {
          email: foundUser?.email,
          roles: foundUser?.role,
          name: foundUser?.name,
        },
        type: 2,
      });

      const newUser = await User.findOneAndUpdate(
        { email: foundUser?.email },
        { refreshToken: refreshToken },
        { new: true }
      );

      await newUser.save();

      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      });

      return res.json({
        status: true,
        message: `${foundUser.name} is logged-in.`,
        data: {
          name: foundUser?.name,
          email: foundUser?.email,
          token: accessToken,
        },
      });
    } else {
      return res
        .status(401)
        .json({ status: false, message: "Invalid Credentials!" });
    }
  } catch (error) {
    console.log(error);
  }
};

const logoutUser = async (req, res) => {
  try {
    const cookies = req.cookies;

    if (!cookies?.jwt) {
      return res.sendStatus(204);
    }

    const refreshToken = cookies.jwt;
    const foundUser = await User.findOne({ refreshToken });

    if (!foundUser) {
      res.clearCookie("jwt", { httpOnly: true });
      return res.sendStatus(204);
    }

    const newUser = await User.findOneAndUpdate(
      { email: foundUser?.email },
      { refreshToken: "" },
      { new: true }
    );

    await newUser.save();
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    }); // secure: true for prod
    res.sendStatus(204);
  } catch (error) {
    console.log(error);
  }
};

function createToken({ data, type }) {
  try {
    if (type === 1) {
      const token = jwt.sign(data, process.env.ACCESS_TOKEN_SEC, {
        expiresIn: "600s",
      });
      return token;
    } else {
      const token = jwt.sign(data, process.env.REFRESH_TOKEN_SEC, {
        expiresIn: "2d",
      });
      return token;
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  createUser,
  loginUser,
  logoutUser,
};
