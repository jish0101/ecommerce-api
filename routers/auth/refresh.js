const express = require('express');
const refreshTokenController = require('../../controllers/auth/refreshTokenController');

const router = express.Router();

router.get('/', refreshTokenController.handleRefreshToken);

module.exports = router;
