/* eslint-disable no-underscore-dangle */
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const User = require('../../models/User/User');
const { createToken } = require('../../utils/utility');

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Email and Password are mandatory!');
  }
  const foundUser = await User.findOne({ email });

  if (!foundUser) {
    res.status(404);
    throw new Error('No user found');
  }

  if (!foundUser.isVerifiedEmail) {
    res.status(401);
    throw new Error('Email is not verified yet');
  }

  const match = await bcrypt.compare(password, foundUser.password);

  if (match === true) {
    const accessToken = createToken({
      data: {
        userId: foundUser?._id,
        email: foundUser?.email,
        role: foundUser?.role,
        name: foundUser?.name,
      },
      type: 1,
    });

    const refreshToken = createToken({
      data: {
        userId: foundUser?._id,
        email: foundUser?.email,
        role: foundUser?.role,
        name: foundUser?.name,
      },
      type: 2,
    });

    const newUser = await User.findOneAndUpdate(
      { email: foundUser?.email },
      { refreshToken },
      { new: true },
    );

    await newUser.save();

    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      sameSite: 'None',
      // secure: true,
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
  }
  res.status(401);
  throw new Error('Invalid Credentials!');
});

const logoutUser = asyncHandler(async (req, res) => {
  const { cookies } = req;

  if (!cookies?.jwt) {
    return res.sendStatus(204);
  }

  const refreshToken = cookies.jwt;
  const foundUser = await User.findOne({ refreshToken });

  if (!foundUser) {
    res.clearCookie('jwt', { httpOnly: true });
    return res.sendStatus(204);
  }

  const newUser = await User.findOneAndUpdate(
    { email: foundUser?.email },
    { refreshToken: '' },
    { new: true },
  );

  await newUser.save();
  res.clearCookie('jwt', {
    httpOnly: true,
    sameSite: 'None',
    // secure: true,
  });
  return res.sendStatus(204);
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const newUser = await User.findOneAndUpdate({ email }, { isVerifiedEmail: true }, { new: true });

  await newUser.save();
  res.json({
    status: true,
    message: `User is validated!`,
  });
});

const newPasswordHandler = asyncHandler(async (req, res) => {
  const { email, newPassword } = req.body;
  const password = await bcrypt.hash(newPassword, 10);
  const newUser = await User.findOneAndUpdate({ email }, { password }, { new: true });

  res.status(200);
  res.json({ status: true, user: newUser });
});

module.exports = {
  loginUser,
  logoutUser,
  verifyEmail,
  newPasswordHandler,
};
