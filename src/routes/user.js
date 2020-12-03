const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user");
router.route("/").get(UserController.getIndex).post(UserController.newUser);

module.exports = router;
