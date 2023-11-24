const express = require('express');
const router = express.Router();

const { createExpanse , fetchExpanse , deleteExpanse} = require('../controllers/ExpanseController');

router.get('/',fetchExpanse);
router.post('/',createExpanse);
router.delete('/:id',deleteExpanse);

module.exports = router;