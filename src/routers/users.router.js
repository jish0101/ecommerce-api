const express = require("express");
const router = express.Router();
const userController = require("../controllers/users.controller.js");

router
  .route("/")
  .post(userController.createUser)
  .get(userController.getUsers)
  .put(userController.updateUser)
  .delete(userController.deleteUsers);

module.exports = router;