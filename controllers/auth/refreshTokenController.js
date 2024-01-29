const secret = require('../../utils/globals');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
// const bcrypt = require("bcrypt");
// const mongoose = require("mongoose");

const handleRefreshToken = async (req, res) => {
  try {
    const cookies = req.cookies;

    if (!cookies?.jwt) {
      return res.sendStatus(401);
    }
    const refreshToken = cookies.jwt;
    const foundUser = await User.findOne({ refreshToken });

    if (!foundUser) {
      return res.sendStatus(403);
    }

    jwt.verify(refreshToken, secret?.refreshTokenSec, (err, decoded) => {
      if (err || decoded.name !== foundUser.name) {
        return res.sendStatus(403);
      }
      const accessToken = createToken({
        data: {
          email: foundUser?.email,
          roles: foundUser?.role,
          name: foundUser?.name
        },
        type: 1
      });

      res.json({
        status: true,
        message: `${foundUser.name} is logged-in.`,
        data: {
          name: foundUser?.name,
          email: foundUser?.email,
          token: accessToken
        }
      });
    });
  } catch (error) {
    console.log(error);
  }
};

function createToken({ data, type }) {
  try {
    if (type === 1) {
      const token = jwt.sign(data, secret?.accessTokenSec, {
        expiresIn: '600s'
      });
      return token;
    } else {
      const token = jwt.sign(data, secret?.refreshTokenSec, {
        expiresIn: '2d'
      });
      return token;
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = { handleRefreshToken };
