const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/admin");

const { authenticationMiddleware, adminMiddleware } = require("../middleware/authentication");

router.route("/").get(AdminController.getDashboard);
router.route("/user/:page").get(AdminController.getAllUser);

router.route("/teacher-management/").get(adminMiddleware(), AdminController.teacherManagement);
router.route("/student-management/").get(adminMiddleware(), AdminController.studentManagement);
router.route("/course-management/").get(adminMiddleware(), AdminController.courseManagement);
router.route("/category-management/").get(adminMiddleware(), AdminController.categoryManagement);

router.route("/editUser/:id").get(adminMiddleware(), AdminController.editUser);
router.route("/editUser/:id").post(adminMiddleware(), AdminController.editedUser);

router.route("/addUser").get(adminMiddleware(), AdminController.addUser);
router.route("/addUser").post(adminMiddleware(), AdminController.addUserPost);

router.route("/change-password/:id").get(adminMiddleware(), AdminController.getUserChangePassword);
router
  .route("/change-password/:id")
  .post(adminMiddleware(), AdminController.postUserChangePassword);

router.route("/deleteUser").post(adminMiddleware(), AdminController.deleteUser);
router.route("/deleteCourse").post(adminMiddleware(), AdminController.deleteCourse);
router.route("/deleteCategory").post(adminMiddleware(), AdminController.deleteCategory);
router.route("/deleteSubCategory").post(adminMiddleware(), AdminController.deleteSubCategory);

router
  .route("/category-management/")
  .post(adminMiddleware(), AdminController.categoryManagementPost);

module.exports = router;
