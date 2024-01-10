const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');

router.post('/login', userController.login);

router
  .route('/:id')
  .get(userController.verifyToken, userController.getUser)
  .patch(userController.verifyToken, userController.updateUser);

module.exports = router;
