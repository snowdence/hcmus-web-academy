const mailer = require('../utils/mailer')
const UserModel = require("../models/User")
const sendMail = async (req, res) => {
  try {
    const {username, to, password, cfpassword} = req.body
    const user = await UserModel.findOne({email: to}).lean()
    if(user){
      res.render("pages/registry", {
        layout: null,
        Message: "This email is already being used. Please try again"
      })
    }
    else{
      const newUser = new UserModel({
        username: username,
        email: to,
        password: password,
        role: 2
      })
      await newUser.save()
      //await mailer.sendMail(to)
      res.render("pages/home")
    }
  } catch (error) {
    console.log(error)
    res.send(error)
  }
}
module.exports = {
  sendMail
}