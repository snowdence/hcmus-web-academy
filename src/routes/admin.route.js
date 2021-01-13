const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/admin");

router.route("/").get(AdminController.getDashboard);
router.route("/user/:page").get(AdminController.getAllUser);
router.route("/teacher-management/").get(AdminController.teacherManagement);
router.route("/student-management/").get(AdminController.studentManagement);
router.route("/editUser/:id").get(AdminController.editUser);
router.route("/editUser/:id").post(AdminController.editedUser);
router.route("/change-password/:id").get(AdminController.getUserChangePassword);
router.route("/change-password/:id").post(AdminController.postUserChangePassword);

module.exports = router;
