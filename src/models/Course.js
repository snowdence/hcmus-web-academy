const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');

const Schema = mongoose.Schema;

mongoose.plugin(slug);

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
  chapters:{
    type: [Schema.Types.ObjectId],
    ref: "Chapter"
  },
  slug: { 
    type: String, 
    slug: 'name', 
    unique:true 
  },
  updatedAt: {
    type: Date
  },
  complete: {
    type: Boolean,
    default: false
  },
}, {timestamps:true});

const mongooseDelete = require('mongoose-delete');
CourseSchema.plugin(mongooseDelete, { overrideMethods: 'all' })

const Course = mongoose.model("Course", CourseSchema);
module.exports = Course;
