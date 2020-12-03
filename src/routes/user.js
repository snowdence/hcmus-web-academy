const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user");
router.route("/").get(UserController.getIndex).post(UserController.postIndex);

module.exports = router;
