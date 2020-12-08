const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const LessonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
  },
  overview: {
    type: String,
  },
  video: {
    type: String,
  },
  description: {
    type: String,
  },
  chapter: {
    type: Schema.Types.ObjectId,
    ref: "Chapter",
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: "Course",
  },
});
const Chapter = mongoose.model("Lesson", LessonSchema);
module.exports = Chapter;
