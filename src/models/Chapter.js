const mongoose = require("moongoose");
const Schema = mongoose.Schema;
const ChapterSchema = new mongoose.Schema({
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
  description: {
    type: String,
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: "Course",
  },
});
const Chapter = mongoose.model("Chapter", ChapterSchema);
module.exports = Chapter;
