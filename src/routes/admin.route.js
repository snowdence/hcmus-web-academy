const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/admin");

router.route("/").get(AdminController.getDashboard);
router.route("/category/:page").get(AdminController.getAllCategory);
module.exports = router;
