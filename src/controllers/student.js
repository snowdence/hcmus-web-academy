const courseModel = require("../models/Course");

const wishlist = async (req, res , next) => {
    const limTop10 = 10;
    const top10Courses = await courseModel.find().lean().limit(limTop10)
    res.render("pages/student/wishlist", {
        title: "Wishlist",
        top10Courses,
    })
    
}

module.exports = {
    wishlist
}