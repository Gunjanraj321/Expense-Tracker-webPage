const express = require('express');
const router = express.Router();

const { processSignup , processlogin } = require('../controllers/userController');

router.post('/signupUser',processSignup);

router.post('/loginUser',processlogin);

module.exports = router;