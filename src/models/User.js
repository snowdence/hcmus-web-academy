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
  otp:{
    type: String
  },
  otp_count: {
    type: Number,
    default: 0
  }
});

const mongooseDelete = require('mongoose-delete');
UserSchema.plugin(mongooseDelete, { overrideMethods: 'all' })

const User = mongoose.model("User", UserSchema);
module.exports = User;
