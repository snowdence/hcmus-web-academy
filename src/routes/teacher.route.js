const express = require("express");
const router = express.Router();

const TeacherController = require("../controllers/teacher")

router.get('/', TeacherController.getIndex)

router.get('/course/', TeacherController.viewCourse)

router.get('/course/:slug', TeacherController.courseDetail)


module.exports = router;
