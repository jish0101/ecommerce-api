const expressAsyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const User = require('../../models/User/User');
const { sendEmail, templateList } = require('../../utils/emailService');
const { STATUSTYPES } = require('../../utils/globals');

const createUser = expressAsyncHandler(async (req, res) => {
  const { name, email, password, image, tempOtp } = req.body;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    res.status(409);
    throw new Error('Email already registered');
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    name,
    email,
    tempOtp,
    status: STATUSTYPES.active,
    profile: image,
    updatedBy: req.userId || '',
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
  const { id, name, email, password, address, tempOtp, image, status } = req.body;

  if (email) {
    const isDuplicate = await User.findOne({
      _id: { $ne: id },
      email,
      // status: { $ne: STATUSTYPES.deleted },
    });
    if (isDuplicate) {
      throw Error('Email already registered');
    }
  }

  const existingUser = await User.findById(id);
  if (!existingUser) {
    res.status(400);
    throw new Error('No user found with this email.');
  }
  const updatedProfile = req?.file ? image : existingUser?.profile;
  const hashedPassword = await bcrypt.hash(password, 10);

  if (email !== existingUser?.email) {
    const isOTPSent = await sendEmail(email, templateList?.otp?.name, { otp: tempOtp?.otp });
    if (!isOTPSent) {
      throw new Error('Error sending otp to the provided email!');
    }
  }

  const newData = {
    name,
    email,
    address,
    tempOtp,
    status,
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

  if (status && allowedStatusToSend.includes(status)) {
    query.status = status;
  }

  if (id) {
    // eslint-disable-next-line no-underscore-dangle
    query._id = id;
  }

  const skip = (pageNum - 1) * size;

  const totalRecords = await User.countDocuments(query);
  const foundUsers = await User.find(query).skip(skip).limit(size).sort({ createdAt: 1 });

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
