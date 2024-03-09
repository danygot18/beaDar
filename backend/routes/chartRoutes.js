const express = require("express");
const router = express.Router();
const chartController = require("../controllers/chartController");

router.get("/get-results-by-question/:id", chartController.getResultsByQuestion);

module.exports = router;
