const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const User = require('../../models/User/User');
const { createToken } = require('../../utils/utility');
const { requestOTP } = require('../../utils/utility');
const { sendEmail, templateList } = require('../../utils/emailService');
const { BASE_URL, PORT } = require('../../utils/globals');

const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, address } = req.body;
  const profile = `${BASE_URL}:${PORT}/public/images/${req?.file?.filename})}`;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    res.status(400);
    throw new Error('Email already registered');
  }
  const tempOtp = requestOTP(10);
  const hashedPassword = await bcrypt.hash(password, 10);

  const isEmailSent = await sendEmail(email, templateList?.welcome?.name, { username: name });
  const isOTPSent = await sendEmail(email, templateList?.otp?.name, { otp: tempOtp?.otp });

  if (!isEmailSent || !isOTPSent) {
    throw new Error('Error sending OTP to Provided Email!');
  }

  const user = new User({
    name,
    email,
    address,
    tempOtp,
    profile,
    password: hashedPassword,
  });

  const savedUser = await user.save();

  res.status(201).json({ status: true, message: `User is created!`, data: savedUser });
});

const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!otp) {
    res.status(400);
    throw new Error('No OTP Provided!');
  }

  if (!email) {
    res.status(400);
    throw new Error('Provide Email!');
  }

  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    res.status(404);
    throw new Error('No user found with this email!');
  }

  if (existingUser.tempOtp?.otp === parseInt(otp, 10)) {
    if (Date.now() > existingUser.tempOtp?.expiredAfter) {
      throw new Error('OTP has been expired!');
    }

    const newUser = await User.findOneAndUpdate(
      { email: existingUser?.email },
      { isVerifiedEmail: true },
      { new: true },
    );

    await newUser.save();
    res.json({
      status: true,
      message: `User is validated!`,
    });
  } else {
    res.status(400);
    throw new Error('Invalid OTP!');
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Email and Password are mandatory!');
  }
  const foundUser = await User.findOne({ email });

  if (!foundUser) {
    res.status(401);
    throw new Error('No user found!');
  }

  if (!foundUser.isVerifiedEmail) {
    res.status(401);
    throw new Error('Email is not verified yet!');
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

module.exports = {
  createUser,
  loginUser,
  logoutUser,
  verifyOTP,
};
