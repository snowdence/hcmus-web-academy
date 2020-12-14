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

const postUserProfile = (req, res, next) => {
  UserModel.updateOne({ fullname: req.user.fullname }, req.body)
    .then()
    .catch((err) => next(err));

  if (req.body.profile_avatar === "") {
    res.render("pages/user/personal-info", {
      userAvatar: req.user.avatar,
      userFullname: req.body.fullname,
      userPhone: req.body.phone,
      userEmail: req.body.email,
      isUpdateSuccessfully: true,
    });
  } else {
    res.render("pages/user/personal-info", {
      userAvatar: req.body.profile_avatar,
      userFullname: req.body.fullname,
      userPhone: req.body.phone,
      userEmail: req.body.email,
    });
  }
};

const postUserAccount = (req, res, next) => {
  UserModel.updateOne({ username: req.user.username }, req.body)
    .then()
    .catch((err) => next(err));
  res.render("pages/user/account-info", {
    userAvatar: req.user.avatar,
    userFullname: req.user.fullname,
    userPhone: req.user.phone,
    userEmail: req.body.email,
    isUpdateSuccessfully: true,
    userName: req.body.username,
  });
};

const postUserChangePassword = (req, res, next) => {
  if (
    req.user.password === req.body.curPassword &&
    req.body.password === req.body.verPassword
  ) {
    UserModel.updateOne({ username: req.user.username }, req.body)
      .then()
      .catch((err) => next(err));
    res.render("pages/user/change-password", {
      userAvatar: req.user.avatar,
      userFullname: req.user.fullname,
      userPhone: req.user.phone,
      userEmail: req.user.email,
      isUpdateSuccessfully: true,
    });
  } else {
    if (req.user.password !== req.body.curPassword) {
      res.render("pages/user/change-password", {
        userAvatar: req.user.avatar,
        userFullname: req.user.fullname,
        userPhone: req.user.phone,
        userEmail: req.user.email,
        isFail: true,
        message: "Wrong password! Please enter again!",
      });
    } else {
      res.render("pages/user/change-password", {
        userAvatar: req.user.avatar,
        userFullname: req.user.fullname,
        userPhone: req.user.phone,
        userEmail: req.user.email,
        isFail: true,
        message: "Verified password doesn't match! Check it again",
      });
    }
  }
};

module.exports = {
  getIndex: getIndex,
  newUser,
  postUserProfile,
  postUserAccount,
  postUserChangePassword,
};
