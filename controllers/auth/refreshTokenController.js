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
    const accessToken = createToken({
      data: {
        userId: foundUser?._id,
        email: foundUser?.email,
        role: foundUser?.role,
        name: foundUser?.name,
      },
      type: 1,
    });

    return res.json({
      status: true,
      message: `${foundUser.name} is logged-in.`,
      data: {
        id: foundUser?._id,
        name: foundUser?.name,
        email: foundUser?.email,
        role: foundUser?.role,
        token: accessToken,
      },
    });
  });
});

module.exports = { handleRefreshToken };
