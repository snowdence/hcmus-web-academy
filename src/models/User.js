const mongoose = require("mongoose");

const schema = mongoose.Schema;

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
    default: 1,
  },
  phone: {
    type: String,
  },
  verified: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
