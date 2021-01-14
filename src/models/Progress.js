const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ProgressSchema = new mongoose.Schema({
    studentID: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    lessonID: {
        type: Schema.Types.ObjectId,
        ref: "Lesson",
    },
    progress: {
        type: Number,
        default: 0,
    },
})

const mongooseDelete = require('mongoose-delete');
ProgressSchema.plugin(mongooseDelete, { overrideMethods: 'all' })

const Progress = mongoose.model("Progress", ProgressSchema);
module.exports = Progress;