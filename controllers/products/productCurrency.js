const expressAsyncHandler = require('express-async-handler');
const { ProductCurrency } = require('../../models/ProductCurrency/ProductCurrency');

const createCurrency = expressAsyncHandler(async (req, res) => {
  const { name, code, symbol } = req.body;

  const currency = new ProductCurrency({
    name,
    code,
    symbol,
  });

  await currency.save();

  res
    .status(201)
    .json({ status: true, message: 'Successfully created a currency', data: currency });
});

// Get all currencies
const getCurrencies = expressAsyncHandler(async (req, res) => {
  const currencies = await ProductCurrency.find();
  res.json({ status: true, data: currencies });
});

// Get a single currency by ID
const getCurrencyById = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;

  const currency = await ProductCurrency.findById(id);
  if (!currency) {
    return res.status(404).json({ status: false, message: 'Currency not found' });
  }

  return res.json({ status: true, data: currency });
});

// Update a currency by ID
const updateCurrency = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, code, symbol } = req.body;

  const updatedCurrency = await ProductCurrency.findByIdAndUpdate(
    id,
    { name, code, symbol },
    { new: true },
  );

  if (!updatedCurrency) {
    return res.status(404).json({ status: false, message: 'Currency not found' });
  }

  return res.json({
    status: true,
    message: 'Successfully updated the currency',
    data: updatedCurrency,
  });
});

// Delete a currency by ID
const deleteCurrency = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;

  const deletedCurrency = await ProductCurrency.findByIdAndDelete(id);

  if (!deletedCurrency) {
    return res.status(404).json({ status: false, message: 'Currency not found' });
  }

  return res.json({ status: true, message: 'Successfully deleted the currency' });
});

module.exports = {
  createCurrency,
  getCurrencies,
  getCurrencyById,
  updateCurrency,
  deleteCurrency,
};
