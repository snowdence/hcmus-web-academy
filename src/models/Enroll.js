const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const EnrollSchema = new mongoose.Schema({
    studentID: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    courseID: {
        type: Schema.Types.ObjectId,
        ref: "Course",
    },
})

const mongooseDelete = require('mongoose-delete');
EnrollSchema.plugin(mongooseDelete, { overrideMethods: 'all' })

const Enroll = mongoose.model("Enroll", EnrollSchema);
module.exports = Enroll;