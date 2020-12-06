const mongoose = require("moongoose");
const Schema = mongoose.Schema;
const CourseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  author_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  thumbnail: {
    type: String,
  },
  overview: {
    type: String,
  },
  description: {
    type: String,
  },
  count_enroll: {
    type: Number,
    default: 0,
  },
  count_view: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
  },
  discount: {
    type: Number,
  },
  created_at: {
    type: Date,
    required: true,
  },
  updated_at: {
    type: Date,
    require: true,
  },
});
const Course = mongoose.model("Course", CourseSchema);
module.exports = Course;
