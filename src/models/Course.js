const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CourseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  overview: {
    type: String,
  },
  sub_category: {
    type: Schema.Types.ObjectId,
    ref: "SubCategory",
  },
  author_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  thumbnail: {
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
  price_discount: {
    type: Number,
  },
  rate: {
    type: Number,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});
const Course = mongoose.model("Course", CourseSchema);
module.exports = Course;
