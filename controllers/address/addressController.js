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

  res.json({ status: true, message: 'Successfully created an address', data: createdAddress });
});

const updateAddress = expressAsyncHandler(async (req, res) => {
  const { userId } = req;
  let newStatus;
  const { id, street, city, state, country, code, status, isPrimary } = req.body;
  const allowedStatuses = [STATUSTYPES.active, STATUSTYPES.inactive];

  if (allowedStatuses.includes(status)) {
    newStatus = status;
  }

  if (isPrimary === 'true' || isPrimary === true) {
    await Address.findOneAndUpdate(
      { userId, isPrimary: true },
      { isPrimary: false },
      { new: true },
    );
  }

  const updatedAddress = await Address.findByIdAndUpdate(
    id,
    { street, city, state, country, code, isPrimary, status: newStatus },
    { new: true },
  );

  res.json({ status: true, message: 'Successfully updated an address', data: updatedAddress });
});

const deleteAddress = expressAsyncHandler(async (req, res) => {
  const { id } = req.query;

  await Address.findByIdAndUpdate(id, { status: STATUSTYPES.deleted });

  res.json({ status: true, message: 'Successfully deleted an address' });
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
