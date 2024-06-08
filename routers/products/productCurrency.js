const express = require('express');
const {
  createCurrency,
  getCurrencies,
  getCurrencyById,
  updateCurrency,
  deleteCurrency,
} = require('../../controllers/products/productCurrency');

const router = express.Router();

// Create a new currency
router.post('/', createCurrency);

// Get all currencies
router.get('/', getCurrencies);

// Get a single currency by ID
router.get('/:id', getCurrencyById);

// Update a currency by ID
router.put('/:id', updateCurrency);

// Delete a currency by ID
router.delete('/:id', deleteCurrency);

module.exports = router;
