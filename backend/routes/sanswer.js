const express = require('express');
const router = express.Router();
const answersController = require('../controllers/sanswerController');

// Route to submit an answer
router.post('/ssubmit', answersController.submitAnswer);
router.get('/sanswer', answersController.getAnswers);
// Other routes can be defined here

module.exports = router;