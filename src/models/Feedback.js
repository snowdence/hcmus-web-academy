const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const FeedbackSchema = new mongoose.Schema({
    studentID: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    courseID: {
        type: Schema.Types.ObjectId,
        ref: "Course",
    },
    rate: {
        type: Number,
        default: 0,
    },
    review:{
        type: String,
    }
})

const mongooseDelete = require('mongoose-delete');
FeedbackSchema.plugin(mongooseDelete, { overrideMethods: 'all' })

const Feedback = mongoose.model("Feedback", FeedbackSchema);
module.exports = Feedback;