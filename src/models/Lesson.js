const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const LessonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  overview: {
    type: String,
  },
  video: {
    type: String,
  }
});
const Lesson = mongoose.model("Lesson", LessonSchema);
module.exports = Lesson;
