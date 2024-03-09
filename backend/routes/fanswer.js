const express = require('express');
const router = express.Router();
const answersController = require('../controllers/FanswerController');

// Route to submit an answer
router.post('/fsubmit', answersController.submitAnswer);
router.get('/fanswer', answersController.getAnswers);
// Other routes can be defined here

router.get('/allFarmeranswer', answersController.getAllAnswers);

module.exports = router;