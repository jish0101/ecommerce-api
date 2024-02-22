const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const { createToken } = require('../../utils/utility');
const secret = require('../../utils/globals');
const User = require('../../models/User/User');

const handleRefreshToken = asyncHandler(async (req, res) => {
  const { cookies } = req;

  if (!cookies?.jwt) {
    return res.sendStatus(401);
  }
  const refreshToken = cookies.jwt;
  const foundUser = await User.findOne({ refreshToken });

  if (!foundUser) {
    return res.sendStatus(403);
  }

  return jwt.verify(refreshToken, secret?.refreshTokenSec, (err, decoded) => {
    if (err || decoded.name !== foundUser.name) {
      return res.sendStatus(403);
    }
    const { _id, name, role, profile, email } = foundUser;

    const accessToken = createToken({
      data: {
        userId: _id,
        email,
        role,
        name,
      },
      type: 1,
    });

    return res.json({
      status: true,
      message: `${foundUser.name} is logged-in.`,
      data: {
        _id,
        name,
        email,
        role,
        token: accessToken,
        profile,
      },
    });
  });
});

module.exports = { handleRefreshToken };
