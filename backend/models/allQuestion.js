const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
  },
});

const allQuestions = mongoose.model('Allquestions', questionSchema);

module.exports = allQuestions;