const User = require("../models/User");

const VALID_FIELDS = ["programming", "networking", "communications"];

// POST /api/quiz/submit
// body: { scores: { programming: number, networking: number, communications: number } }
// OR    { answers: [0,1,2,...] } where each value is the index (0,1,2) of the chosen option
exports.submitQuiz = async (req, res) => {
  try {
    const { scores, answers } = req.body;
    let finalScores = { programming: 0, networking: 0, communications: 0 };

    if (scores && typeof scores === "object") {
      VALID_FIELDS.forEach((f) => {
        finalScores[f] = Number(scores[f]) || 0;
      });
    } else if (Array.isArray(answers)) {
      // answers[i] is 0 (programming), 1 (networking), or 2 (communications)
      answers.forEach((ans) => {
        if (ans === 0) finalScores.programming++;
        else if (ans === 1) finalScores.networking++;
        else if (ans === 2) finalScores.communications++;
      });
    } else {
      return res.status(400).json({ message: "Provide either 'scores' or 'answers'." });
    }

    // Determine the best match (highest score)
    const recommendedField = VALID_FIELDS.reduce((best, field) =>
      finalScores[field] > finalScores[best] ? field : best
    , VALID_FIELDS[0]);

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    user.quizScores = finalScores;
    user.recommendedField = recommendedField;
    user.quizCompleted = true;
    // Reset progress if the field changed (new roadmap)
    user.roadmapProgress = [];

    await user.save();

    res.json({
      recommendedField,
      scores: finalScores,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error submitting quiz." });
  }
};

// GET /api/quiz/result
exports.getResult = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    if (!user.quizCompleted) {
      return res.status(404).json({ message: "Quiz not completed yet." });
    }

    res.json({
      recommendedField: user.recommendedField,
      scores: user.quizScores,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching quiz result." });
  }
};
