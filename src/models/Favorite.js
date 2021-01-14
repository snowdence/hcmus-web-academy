const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const FavoriteSchema = new mongoose.Schema({
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
FavoriteSchema.plugin(mongooseDelete, { overrideMethods: 'all' })

const Favorite = mongoose.model("Favorite", FavoriteSchema);
module.exports = Favorite;