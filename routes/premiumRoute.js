const express = require('express');
const { premiumPending, premiumVerification } = require('../controllers/premiumController');
const router = express.Router();

router.get('/takepremium',premiumPending);
router.post('/updatetransactionstatus',premiumVerification);

module.exports = router;