const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const SubCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  parent_category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
  },
  thumbnail: {
    type: String,
  }
});

const mongooseDelete = require('mongoose-delete');
SubCategorySchema.plugin(mongooseDelete, { overrideMethods: 'all' })

const SubCategory = mongoose.model("SubCategory", SubCategorySchema);
module.exports = SubCategory;
