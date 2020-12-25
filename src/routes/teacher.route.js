const express = require("express");
const router = express.Router();

const TeacherController = require("../controllers/teacher")

router.get('/', TeacherController.getIndex)

router.get('/course/', TeacherController.viewCourse)

router.get('/course/create', TeacherController.createCourse)

router.post('/course/create', TeacherController.courseCreated)

router.get('/course/:slug', TeacherController.courseDetail)

router.get('/course/:slug/edit', TeacherController.courseEdit)

router.post('/course/:slug/edit', TeacherController.editCourse)



module.exports = router;

