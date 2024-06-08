const addressRouter = require('express').Router();
const {
  createAddress,
  updateAddress,
  deleteAddress,
  getAddresses,
} = require('../../controllers/address/addressController');

addressRouter.route('/').get(getAddresses).post(createAddress).put(updateAddress);

addressRouter.delete('/:id', deleteAddress);

module.exports = addressRouter;
