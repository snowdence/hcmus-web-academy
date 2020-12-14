const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/admin");

router.route("/").get(AdminController.getDashboard);
router.route("/user/:page").get(AdminController.getAllUser);
module.exports = router;
