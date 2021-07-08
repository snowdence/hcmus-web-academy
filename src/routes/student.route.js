const express = require("express");
const router = express.Router();
const studentController = require("../controllers/student");

router.route("/watchlist/:page").get(studentController.wishlist);
router.route("/myCourses/:page").get(studentController.myCourse);
router.route("/all-courses/:page").get(studentController.allCourses);


router.route("/review-courses").get(studentController.review);

router.route("/archived").get((req, res)=>{
    res.render("pages/student/archived", {
        title: "Archived"
    })
});

router.get('/course/:slug/:lesson', studentController.lessonDetail)
router.get('/course/:slug', studentController.courseDetail)
router.post('/update-progress', studentController.updateProgress)
router.post('/rate', studentController.rate)
router.post('/feedback', studentController.feedback)
router.post('/favorite', studentController.favorite)
router.post('/enroll', studentController.enroll)

//router.route("/archived").get(studentController.archived);
module.exports = router;