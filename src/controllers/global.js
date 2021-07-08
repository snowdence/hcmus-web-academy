
const SubCategoryModel = require("../models/SubCategory")
const CategoryModel = require("../models/Category");

const mongoose = require('mongoose');

const categoryManagement = async (req, res, next) => {
    let Category = await CategoryModel.find().lean();
    for (x of Category) {
      let SubCategory = await SubCategoryModel.find({
        parent_category: x._id,
      }).lean();
      x.sub_categories = SubCategory;
    }
    return Category
  };
  module.exports = categoryManagement
