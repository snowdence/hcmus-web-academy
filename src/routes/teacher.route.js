const express = require("express");
const router = express.Router();

const TeacherController = require("../controllers/teacher")


router.route("/course").get(TeacherController.viewCourse);
module.exports = router;
