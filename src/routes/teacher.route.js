const express = require("express");
const router = express.Router();
const { authenticationMiddleware, adminMiddleware, teacherMiddleware } = require("../middleware/authentication");

const TeacherController = require("../controllers/teacher")

router.route('/').get(teacherMiddleware(), TeacherController.getIndex)

router.route('/courses/:page').get(teacherMiddleware(), TeacherController.viewCourse)

router.route('/course/create').get(teacherMiddleware(), TeacherController.createCourse)

router.route('/course/create').post(teacherMiddleware(), TeacherController.courseCreated)

router.route('/course/:slug').get(teacherMiddleware(), TeacherController.courseDetail)

router.route('/course/:slug/edit').get(teacherMiddleware(), TeacherController.courseEdit)

router.route('/course/:slug/edit').post(teacherMiddleware(), TeacherController.editCourse)

router.route('/upload').post(teacherMiddleware(), TeacherController.upload)

module.exports = router;

