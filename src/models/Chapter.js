const mongoose = require("mongoose");
const Lesson = require("./Lesson");
const Schema = mongoose.Schema;
const ChapterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
    lesson:[
    {
      type: Schema.Types.ObjectId,
      ref: "Lesson"
    }
  ],
  // course: {
  //   type: Schema.Types.ObjectId,
  //   ref: "Course",
  // },
});
const Chapter = mongoose.model("chapter", ChapterSchema);
module.exports = Chapter;
