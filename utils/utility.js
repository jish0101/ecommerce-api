const crypto = require('crypto');

const requestOTP = (expirationTimeInMinutes = 10) => {
  try {
    const otp = crypto.randomInt(100000, 1000000);
    const currentTimestamp = Date.now();
    const expiredAfter = currentTimestamp + expirationTimeInMinutes * 60 * 1000; // Convert minutes to milliseconds
    return { otp, expiredAfter };
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  requestOTP,
};
