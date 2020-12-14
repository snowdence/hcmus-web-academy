const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user");
router.route("/").get(UserController.getIndex).post(UserController.newUser);
//url la user/profile

module.exports = router;
