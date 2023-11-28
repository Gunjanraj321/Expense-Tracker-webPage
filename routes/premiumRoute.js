const express = require('express');
const { premiumPending, premiumVerification } = require('../controllers/premiumController');
const getUserLeaderBoard = require("../controllers/leadboardController")
const router = express.Router();

router.get('/takepremium',premiumPending);
router.post('/updatetransactionstatus',premiumVerification);
router.get('/leaderboard',getUserLeaderBoard)

module.exports = router;