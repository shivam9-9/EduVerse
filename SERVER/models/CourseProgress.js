const mongoose = require("mongoose");

const courseProgress = new mongoose.Schema({
  courseID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Corse",
  },
  completedVideos: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subsection",
  },
});
module.exports = mongoose.model("CourseProgress", courseProgress);
