const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  fullname: {
    type: String,
  },
  avatar: {
    type: String,
  },
  role: {
    type: Number,
    default: 2,
  },
  phone: {
    type: String,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  list_courses: [
    {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
  otp:{
    type: String
  },
  otp_count: {
    type: Number,
    default: 0
  }
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
