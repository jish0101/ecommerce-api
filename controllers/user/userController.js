const expressAsyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const User = require('../../models/User/User');
const { sendEmail, templateList } = require('../../utils/emailService');
const { STATUSTYPES } = require('../../utils/globals');

const createUser = expressAsyncHandler(async (req, res) => {
  const { name, email, password, address, profile, tempOtp } = req.body;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    res.status(400);
    throw new Error('Email already registered');
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    name,
    email,
    address,
    tempOtp,
    status: STATUSTYPES.inactive,
    profile,
    password: hashedPassword,
  });

  const isEmailSent = await sendEmail(email, templateList?.welcome?.name, { username: name });
  const isOTPSent = await sendEmail(email, templateList?.otp?.name, { otp: tempOtp?.otp });

  if (!isEmailSent || !isOTPSent) {
    throw new Error('Error sending otp to the provided email!');
  }
  const savedUser = await user.save();

  res.status(201).json({ status: true, message: `User is created!`, data: savedUser });
});

const updateUser = expressAsyncHandler(async (req, res) => {
  const { name, email, password, address, tempOtp, profile } = req.body;
  const { id } = req.query;
  const existingUser = await User.findById(id);

  if (!existingUser) {
    res.status(400);
    throw new Error('No user found with this email.');
  }
  const updatedProfile = req?.file ? profile : existingUser?.profile;
  const hashedPassword = await bcrypt.hash(password, 10);

  if (email !== existingUser?.email) {
    const isEmailSent = await sendEmail(email, templateList?.welcome?.name, { username: name });
    const isOTPSent = await sendEmail(email, templateList?.otp?.name, { otp: tempOtp?.otp });
    if (!isEmailSent || !isOTPSent) {
      throw new Error('Error sending otp to the provided email!');
    }
  }

  const newData = {
    name,
    email,
    address,
    tempOtp,
    isVerifiedEmail: email === existingUser?.email,
    profile: updatedProfile,
    password: hashedPassword,
  };

  const newUser = await User.findByIdAndUpdate(id, newData, { new: true });

  res.status(201).json({ status: true, message: `User is updated!`, data: newUser });
});

const getUsers = expressAsyncHandler(async (req, res) => {
  const { id, name, status, page = 1, rowCount = 10 } = req.query;

  const pageNum = parseInt(page, 10);
  const size = parseInt(rowCount, 10);

  const allowedStatusToSend = [STATUSTYPES.active, STATUSTYPES.inactive];
  const query = {
    status: { $in: allowedStatusToSend },
  };

  if (name) {
    query.name = { $regex: new RegExp(name, 'i') };
  }

  if (status) {
    if (allowedStatusToSend.includes(status)) query.status = status;
  }

  if (id) {
    // eslint-disable-next-line no-underscore-dangle
    query._id = id;
  }

  const skip = (pageNum - 1) * size;

  const totalRecords = await User.countDocuments(query);
  const foundUsers = await User.find(query).skip(skip).limit(size);

  if (foundUsers.length > 0) {
    const totalPages = Math.ceil(totalRecords / size);
    return res.json({
      status: true,
      data: foundUsers,
      pagintation: {
        totalPages,
        totalRecords,
        page,
      },
    });
  }
  return res.json({ status: true, message: 'No users found' });
});

const deleteUser = expressAsyncHandler(async (req, res) => {
  const { id } = req.query;
  const deletedUser = await User.findByIdAndUpdate(id, { status: STATUSTYPES.deleted });

  if (deletedUser) {
    res.json({ status: true, message: `User with id: ${id} is deleted` });
  }

  throw Error('User not found');
});

module.exports = {
  createUser,
  updateUser,
  getUsers,
  deleteUser,
};
