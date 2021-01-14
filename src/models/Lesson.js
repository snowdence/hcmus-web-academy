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
  preview: {
    type: Boolean,
    default: false,
  },
  video: {
    type: String,
  }
});

const mongooseDelete = require('mongoose-delete');
LessonSchema.plugin(mongooseDelete, { overrideMethods: 'all' })

const Lesson = mongoose.model("Lesson", LessonSchema);
module.exports = Lesson;
