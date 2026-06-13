// Static "Explore" resources (articles/videos) related to each field.
const EXPLORE_DATA = {
  programming: [
    {
      title: "البرمجة مش للجميع - بودكاست",
      type: "podcast",
      url: "#",
    },
    {
      title: "كيف تبدأ رحلتك البرمجية صح؟",
      type: "video",
      url: "#",
    },
  ],
  networking: [
    {
      title: "أساسيات الشبكات للمبتدئين",
      type: "article",
      url: "#",
    },
  ],
  communications: [
    {
      title: "مقدمة لهندسة الاتصالات",
      type: "article",
      url: "#",
    },
  ],
};

// GET /api/explore
// Returns general explore content, plus field-specific content if the user
// has a recommended field (req.user is optional here - auth not required).
exports.getExplore = async (req, res) => {
  const all = Object.values(EXPLORE_DATA).flat();
  res.json({ items: all, byField: EXPLORE_DATA });
};
