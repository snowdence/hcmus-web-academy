/*
 * We can interact with mongoose in 3 ways
 * Callback
 * Promise
 * Async/Await (Promises)
 */

const UserModel = require("../models/User");

/**
 * get all user use promise style
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
const getIndex = (req, res, next) => {
  UserModel.find({})
    .then((users) => {
      console.log("Founded users: ", users);
    })
    .catch((err) => next(err));
  return res.status(200).json({
    message: "Users GET root",
  });
};

const newUser = (req, res, next) => {
  const newUser = new UserModel(req.body);
  console.log(newUser);
  newUser
    .save()
    .then((user) => {
      console.log("Success to insert user");
      console.log(user);
    })
    .catch((err) => {
      if (error.message.indexOf("11000") != -1) {
        console.log("[ERROR] Existed user: " + err);
      } else {
        console.log("[ERROR] " + err);
      }
    });

  return res.status(200).json({
    message: "POST request to user root",
  });
};


const postUserProfile = (req, res, next) =>{
  console.log(req.body)
  res.render("pages/user/personal-info", {
    userAvatar: req.body.profile_avatar,
    userFullname: req.body.fullname,
    userPhone: req.body.phone,
    userEmail: req.body.email,
  })
}

module.exports = {
  getIndex: getIndex,
  newUser,
  postUserProfile,
};
