/** @format */

const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyJWT = (req, res, next) => {
  try {
    const authHeader =
      req.headers["Authorization"] || req.headers["authorization"];

    if (!authHeader) {
      return res.sendStatus(401);
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SEC, (err, decoded) => {
      if (err) return res.sendStatus(403);
      req.user = decoded.name;
      next();
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = verifyJWT;
