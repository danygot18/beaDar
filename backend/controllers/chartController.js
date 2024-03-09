const FarmerQuestion = require("../models/farmerQuestions");
const FarmerAnswer = require("../models/fanswer");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

exports.getResultsByQuestion = async (req, res, next) => {
  try {
    const farmerQuestion = await FarmerQuestion.findById(req.params.id);

    const farmerAnswers = await FarmerAnswer.find();

    const flattenedAnswers = farmerAnswers.flatMap((item) => item.answers);
    const results = flattenedAnswers.filter(
      (item) => item.questions.toString() === farmerQuestion._id.toString()
    );

    const initialResults = results.reduce((acc, curr) => {
      const option = curr.selectedOption;
      acc[option] = (acc[option] || 0) + 1;
      return acc;
    }, {});

    const answers = farmerQuestion.options.reduce((acc, option) => {
      acc[option] = 0;
      return acc;
    }, {});

    for (const option in initialResults) {
      answers[option] = initialResults[option];
    }

    if (!farmerQuestion) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    return res.status(200).json({
      success: true,
      farmerQuestion: farmerQuestion,
      answers: answers,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};
