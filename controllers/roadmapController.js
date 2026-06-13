const User = require("../models/User");
const roadmaps = require("../data/roadmaps");

// GET /api/roadmap
exports.getRoadmap = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    if (!user.recommendedField) {
      return res.status(404).json({
        message: "No recommended field yet. Please complete the quiz first.",
      });
    }

    const roadmap = roadmaps[user.recommendedField];
    const completed = user.roadmapProgress || [];

    const steps = roadmap.steps.map((step) => ({
      ...step,
      completed: completed.includes(step.id),
    }));

    const total = steps.length;
    const done = steps.filter((s) => s.completed).length;

    res.json({
      field: user.recommendedField,
      title: roadmap.title,
      steps,
      progress: {
        completed: done,
        total,
        percentage: total ? Math.round((done / total) * 100) : 0,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching roadmap." });
  }
};

// POST /api/roadmap/progress
// body: { stepId: "prog-3", completed: true }
exports.updateProgress = async (req, res) => {
  try {
    const { stepId, completed } = req.body;
    if (!stepId) return res.status(400).json({ message: "stepId is required." });

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    if (!user.recommendedField) {
      return res.status(400).json({ message: "Complete the quiz before tracking progress." });
    }

    const validIds = roadmaps[user.recommendedField].steps.map((s) => s.id);
    if (!validIds.includes(stepId)) {
      return res.status(400).json({ message: "Invalid stepId for this roadmap." });
    }

    const set = new Set(user.roadmapProgress || []);
    if (completed === false) {
      set.delete(stepId);
    } else {
      set.add(stepId);
    }
    user.roadmapProgress = Array.from(set);

    await user.save();

    const total = validIds.length;
    const done = user.roadmapProgress.length;

    res.json({
      roadmapProgress: user.roadmapProgress,
      progress: {
        completed: done,
        total,
        percentage: total ? Math.round((done / total) * 100) : 0,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error updating progress." });
  }
};
