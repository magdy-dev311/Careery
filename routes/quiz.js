const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { submitQuiz, getResult } = require("../controllers/quizController");

router.post("/submit", auth, submitQuiz);
router.get("/result", auth, getResult);

module.exports = router;
