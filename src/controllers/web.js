const courseModel = require("../models/Course");

const getHomePage = async (req, res , next) => {
    const limTop10 = 10;
    const limTop5 = 5;
    const top10Courses = await courseModel.find().lean().limit(limTop10)
    const top5Courses = await  courseModel.find().lean().limit(limTop5).skip(limTop10)
    res.render("pages/home", {
        title: "Home",
        top10Courses,
        top5Courses,
    });
    
}

module.exports = {
    getHomePage,
}