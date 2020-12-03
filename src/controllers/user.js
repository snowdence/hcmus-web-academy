/*
 * We can interact with mongoose in 3 ways
 * Callback
 * Promise
 * Async/Await (Promises)
 */

const UserModel = require("../models/User");

const getIndex = (req, res, next) => {
  UserModel.find({}, (err, users) => {
    if (err) {
      return next(err);
    }
    console.log("Founded users ", users);
  });

  return res.status(200).json({
    message: "Users GET root",
  });
};

const newUser = (req, res, next) => {
  console.log("request body ", req.body);

  const newUser = new UserModel(req.body);
  console.log(newUser);

  newUser.save((err, user) => {
    if (err) {
      console.log("[ERROR] Existed user");
    } else {
      console.log("Success to insert user");
      console.log(user);
    }
  });

  return res.status(200).json({
    message: "POST request to user root",
  });
};
module.exports = {
  getIndex: getIndex,
  newUser,
};
