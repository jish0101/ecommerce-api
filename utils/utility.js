const jwt = require('jsonwebtoken');
const { accessTokenSec, refreshTokenSec } = require('./globals');

function createToken({ data, type }) {
  if (type === 1) {
    const token = jwt.sign(data, accessTokenSec, {
      expiresIn: '1d',
    });
    return token;
  }

  const token = jwt.sign(data, refreshTokenSec, {
    expiresIn: '2d',
  });
  return token;
}

module.exports = {
  createToken,
};
