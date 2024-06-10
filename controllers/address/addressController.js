const expressAsyncHandler = require('express-async-handler');
const { Address } = require('../../models/Address/Address');
const { STATUSTYPES, USER_ROLES } = require('../../utils/globals');

const createAddress = expressAsyncHandler(async (req, res) => {
  const { street, city, state, country, code } = req.body;
  const { userId } = req;

  const existingAddress = await Address.findOne({ userId });

  const createdAddress = await Address.create({
    userId,
    street,
    city,
    state,
    country,
    code,
    isPrimary: !existingAddress,
  });

  return res.json({
    status: true,
    message: 'Successfully created an address',
    data: createdAddress,
  });
});

const updateAddress = expressAsyncHandler(async (req, res) => {
  const { _id, street, city, state, country, code, isPrimary } = req.body;

  const newAddress = {
    street,
    city,
    state,
    country,
    code,
  };

  if (isPrimary) {
    // Find the current primary address and set it to false
    const existingPrimaryAddress = await Address.findOne({ isPrimary: true });
    if (existingPrimaryAddress) {
      existingPrimaryAddress.isPrimary = false;
      await existingPrimaryAddress.save();

      await Address.findByIdAndUpdate(_id, { isPrimary: true });
      return res.json({ status: true, message: 'Successfully updated your default address' });
    }
  }

  // Update the provided address
  const updatedAddress = await Address.findByIdAndUpdate(_id, newAddress, { new: true });

  return res.json({
    status: true,
    message: 'Successfully updated your address',
    data: updatedAddress,
  });
});

const deleteAddress = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;

  const foundAdd = await Address.findById(id);

  if (!foundAdd) {
    return res.json({ status: false, message: 'Product not found' });
  }

  if (foundAdd.isPrimary) {
    return res.json({ status: false, message: 'Primary address cannot be removed' });
  }

  foundAdd.status = STATUSTYPES.deleted;

  await foundAdd.save();

  return res.json({ status: true, message: 'Successfully deleted an address' });
});

const getAddresses = expressAsyncHandler(async (req, res) => {
  const query = {};
  const { userId, role } = req;
  const { status, page = 1, rowCount = 10 } = req.query;

  const allowedStatuses = [STATUSTYPES.active, STATUSTYPES.inactive];
  const size = parseInt(rowCount, 10);
  const pageNum = parseInt(page, 10);

  if (role === USER_ROLES.member) {
    query.userId = userId;
  }

  query.status = { $in: allowedStatuses };

  if (status && allowedStatuses.includes(status)) {
    query.status = STATUSTYPES.active;
  }

  const skip = (pageNum - 1) * size;
  const totalRecords = await Address.countDocuments(query);
  const totalPages = Math.ceil(totalRecords / size);
  const foundAddresses = await Address.find(query).skip(skip).limit(size);

  res.json({
    status: true,
    message: 'Successfully fetched addresses',
    data: foundAddresses,
    pagintaion: {
      totalPages,
      totalRecords,
      page: pageNum,
    },
  });
});

module.exports = {
  createAddress,
  updateAddress,
  deleteAddress,
  getAddresses,
};
