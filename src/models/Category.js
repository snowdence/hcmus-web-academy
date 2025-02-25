const mongoose = require("mongoose");
const mongooseDelete = require('mongoose-delete');
const Schema = mongoose.Schema;

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  sub_categories: [
    {
      type: Schema.Types.ObjectId,
      ref: "SubCategory",
    },
  ],
});

CategorySchema.plugin(mongooseDelete, { overrideMethods: 'all' })

const Category = mongoose.model("Category", CategorySchema);
module.exports = Category;
