const express = require("express");
const router = express.Router();
const authController = require("../../controllers/auth/authController");

router.post("/create", authController.createUser);
router.post("/login", authController.loginUser);
router.get("/logout", authController.logoutUser);

module.exports = router;
