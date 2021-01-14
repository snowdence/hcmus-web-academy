const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/admin");

router.route("/").get(AdminController.getDashboard);
router.route("/user/:page").get(AdminController.getAllUser);

router.route("/teacher-management/").get(AdminController.teacherManagement);
router.route("/student-management/").get(AdminController.studentManagement);
router.route("/course-management/").get(AdminController.courseManagement);
router.route("/category-management/").get(AdminController.categoryManagement);

router.route("/editUser/:id").get(AdminController.editUser);
router.route("/editUser/:id").post(AdminController.editedUser);

router.route("/addUser").get(AdminController.addUser);
router.route("/addUser").post(AdminController.addUserPost);

router.route("/change-password/:id").get(AdminController.getUserChangePassword);
router
  .route("/change-password/:id")
  .post(AdminController.postUserChangePassword);

router.route("/deleteUser").post(AdminController.deleteUser);
router.route("/deleteCourse").post(AdminController.deleteCourse);
router.route("/deleteCategory").post(AdminController.deleteCategory);
router.route("/deleteSubCategory").post(AdminController.deleteSubCategory);

router
  .route("/category-management/")
  .post(AdminController.categoryManagementPost);

module.exports = router;
