require('dotenv').config();
const jwt = require('jsonwebtoken');
const { accessTokenSec } = require('../utils/globals');

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.Authorization || req.headers.authorization;

  if (!authHeader) {
    res.status(401);
    throw new Error('Unauthorized');
  }

  const token = authHeader.split(' ')[1];

  return jwt.verify(token, accessTokenSec, (err, decoded) => {
    if (err) {
      res.status(403);
      throw new Error('Unauthorized');
    }

    req.user = decoded.name;
    req.role = parseInt(decoded.role, 10);
    return next();
  });
};

module.exports = verifyJWT;
