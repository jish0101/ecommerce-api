const express = require('express');
const userController = require('../../controllers/user/usersController');

const router = express.Router();

router
  .route('/')
  .post(userController.createUser)
  .get(userController.getUsers)
  .put(userController.updateUser)
  .delete(userController.deleteUsers);

module.exports = router;
