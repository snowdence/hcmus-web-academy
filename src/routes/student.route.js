const express = require("express");
const router = express.Router();
const studentController = require("../controllers/student");

router.route("/wishlist").get(studentController.wishlist);

router.route("/all-courses").get((req, res)=>{
    res.render("pages/student/all-courses", {
        title: "All Courses"
    })
});

router.route("/review-courses").get((req, res)=>{
    res.render("pages/student/review-courses", {
        title: "Review Courses"
    })
});

router.route("/archived").get((req, res)=>{
    res.render("pages/student/archived", {
        title: "Archived"
    })
});

router.get('/course/:slug', studentController.courseDetail)
router.post('/update-progress', studentController.updateProgress)
router.post('/rate', studentController.rate)
router.post('/feedback', studentController.feedback)

module.exports = router;