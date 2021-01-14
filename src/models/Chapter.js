const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ChapterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  lessons: [
    {
      type: Schema.Types.ObjectId,
      ref: "Lesson"
    }
  ],
});

const mongooseDelete = require('mongoose-delete');
ChapterSchema.plugin(mongooseDelete, { overrideMethods: 'all' })

const Chapter = mongoose.model("Chapter", ChapterSchema);
module.exports = Chapter;
