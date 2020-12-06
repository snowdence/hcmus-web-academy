const mongoose = require("moongoose");
const schema = mongoose.Schema;
const CourseSchema = new mongoose.Schema({
  course_name: {
    type: String,
    required: true,
  },
});
