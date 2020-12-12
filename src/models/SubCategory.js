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
});
const SubCategory = mongoose.model("SubCategory", SubCategorySchema);
module.exports = SubCategory;
