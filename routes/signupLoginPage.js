const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')

router.post('/signup',userController.processSignup);
router.post('/login',userController.processlogin);

module.exports = router;