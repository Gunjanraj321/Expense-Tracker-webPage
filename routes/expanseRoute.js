const express = require('express');
const router = express.Router();

const { createExpanse , fetchExpanse , deleteExpanse , getExpenseById} = require('../controllers/ExpanseController');

router.get('/',fetchExpanse);
router.post('/',createExpanse);
router.delete('/:id',deleteExpanse);
router.get('./:id',getExpenseById)

module.exports = router;