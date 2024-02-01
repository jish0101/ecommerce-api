const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { accessTokenSec, refreshTokenSec } = require('./globals');

const requestOTP = (expirationTimeInMinutes = 10) => {
  const otp = crypto.randomInt(100000, 1000000);
  const currentTimestamp = Date.now();
  const expiredAfter = currentTimestamp + expirationTimeInMinutes * 60 * 1000;
  return { otp, expiredAfter };
};

function createToken({ data, type }) {
  if (type === 1) {
    const token = jwt.sign(data, accessTokenSec, {
      expiresIn: '600s',
    });
    return token;
  }

  const token = jwt.sign(data, refreshTokenSec, {
    expiresIn: '2d',
  });
  return token;
}

module.exports = {
  requestOTP,
  createToken,
};
