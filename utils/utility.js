const jwt = require('jsonwebtoken');
const moment = require('moment');
const { accessTokenSec, refreshTokenSec } = require('./globals');

function createToken({ data, type }) {
  if (type === 1) {
    const token = jwt.sign(data, accessTokenSec, {
      expiresIn: 3600,
    });
    return token;
  }

  const token = jwt.sign(data, refreshTokenSec, {
    expiresIn: 3600 * 24,
  });
  return token;
}

function normaliseDate(dateString) {
  if (dateString) {
    const formatsToTry = [
      'YYYY-MM-DDTHH:mm:ss.SSSZ',
      'YYYY-MM-DD HH:mm:ss',
      'YYYY-MM-DD',
      'YYYY/MM/DD HH:mm:ss',
      'YYYY/MM/DD',
      'MM-DD-YYYY HH:mm:ss',
      'MM-DD-YYYY',
      'MM/DD/YYYY HH:mm:ss',
      'MM/DD/YYYY',
      'DD-MM-YYYY HH:mm:ss',
      'DD-MM-YYYY',
      'DD/MM/YYYY HH:mm:ss',
      'DD/MM/YYYY',
    ];

    let parsedDate;
    // eslint-disable-next-line no-restricted-syntax
    for (const format of formatsToTry) {
      parsedDate = moment(dateString, format, true);
      if (parsedDate.isValid()) {
        return parsedDate.toDate();
      }
    }
  }
  return null;
}

module.exports = {
  createToken,
  normaliseDate,
};
