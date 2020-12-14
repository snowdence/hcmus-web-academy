const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/admin");

router.route("/").get(AdminController.getIndex);

module.exports = router;
