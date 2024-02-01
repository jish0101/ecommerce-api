require('dotenv').config();
const jwt = require('jsonwebtoken');
const { accessTokenSec } = require('../utils/globals');

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.Authorization || req.headers.authorization;

  if (!authHeader) {
    return res.sendStatus(401);
  }

  const token = authHeader.split(' ')[1];

  return jwt.verify(token, accessTokenSec, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.user = decoded.name;
    return next();
  });
};

module.exports = verifyJWT;
