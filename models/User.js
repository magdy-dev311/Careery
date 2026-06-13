const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },

    // Quiz / recommendation
    recommendedField: {
      type: String,
      enum: ["programming", "networking", "communications", null],
      default: null,
    },
    quizScores: {
      programming: { type: Number, default: 0 },
      networking: { type: Number, default: 0 },
      communications: { type: Number, default: 0 },
    },
    quizCompleted: { type: Boolean, default: false },

    // Roadmap progress: array of completed step ids for the recommended field
    roadmapProgress: { type: [String], default: [] },
  },
  { timestamps: true }
);

// Virtual: initials (first letter of first name + first letter of last name)
userSchema.virtual("initials").get(function () {
  const f = this.firstName ? this.firstName.trim().charAt(0).toUpperCase() : "";
  const l = this.lastName ? this.lastName.trim().charAt(0).toUpperCase() : "";
  return `${f}${l}`;
});

userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("User", userSchema);
