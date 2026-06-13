const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { getRoadmap, updateProgress } = require("../controllers/roadmapController");

router.get("/", auth, getRoadmap);
router.post("/progress", auth, updateProgress);

module.exports = router;
