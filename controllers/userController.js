const User = require("../models/User");
const { publicUser } = require("./authController");

// GET /api/users/me  (Profile page)
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json({ user: publicUser(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching profile." });
  }
};

// PUT /api/users/me  (update name)
exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName } = req.body;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    if (firstName) user.firstName = firstName.trim();
    if (lastName) user.lastName = lastName.trim();

    await user.save();
    res.json({ user: publicUser(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error updating profile." });
  }
};
