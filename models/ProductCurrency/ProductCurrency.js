const mongoose = require('mongoose');

const defaultProductCurrency = {
  _id: '65c45ea214a2365ad280c0a9',
  name: 'US Dollar',
  code: 'USD',
  symbol: '$',
};

const ProductCurrencySchema = new mongoose.Schema({
  name: {
    type: String,
    default: defaultProductCurrency.name,
  },
  code: {
    type: String,
    default: defaultProductCurrency.code,
  },
  symbol: {
    type: String,
    default: defaultProductCurrency.symbol,
  },
});

const ProductCurrency = mongoose.model('ProductCurrency', ProductCurrencySchema);

module.exports = { ProductCurrency, ProductCurrencySchema, defaultProductCurrency };
