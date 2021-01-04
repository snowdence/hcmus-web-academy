const courseModel = require("../models/Course");

const wishlist = async (req, res , next) => {
    const lim = 10;
    const page = req.params.page || 1;
    const top10Courses = await courseModel.find().lean().skip((lim * page) - lim).limit(lim)
    const count = await courseModel.countDocuments()
    let listpage = []
    const totalpage = Math.ceil(count / lim)
    for(let i = 0; i < totalpage; i++)
    {
        listpage[i] = ""
    }
    listpage[page]="datatable-pager-link-active"
    res.render("pages/student/watchlist", {
        title: "Watchlist",
        top10Courses,
        listpage,
    })
    
}

const review = async (req, res , next) => {
    const limTop10 = 10;
    const top10Courses = await courseModel.find().lean().limit(limTop10)
    res.render("pages/student/review-courses", {
        title: "Review",
        top10Courses,
    })
    
}

const archived = async (req, res , next) => {
    const limTop10 = 10;
    const top10Courses = await courseModel.find().lean().limit(limTop10)
    res.render("pages/student/archived", {
        title: "Archived",
        top10Courses,
    })
    
}

module.exports = {
    wishlist,
    review,
    archived,
}