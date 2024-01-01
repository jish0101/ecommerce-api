/** @format */

const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

router.post("/create", authController.createUser);
router.post("/login", authController.loginUser);

module.exports = router;
