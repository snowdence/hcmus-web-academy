const mailer = require('../utils/mailer')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const UserModel = require("../models/User")
let useremail;
const sendMail = async (req, res, next) => {
  try {
    const {username, to, password, cfpassword} = req.body
    const hashpw = await bcrypt.hash(password, saltRounds)
    const user = await UserModel.findOne({email: to}).lean()
    if(user){
      res.render("pages/registry", {
        layout: null,
        Message: "This email is already being used. Please try again"
      })
    }
    else{
      await mailer.sendMail(to)
      const newUser = new UserModel({
        username: username,
        email: to,
        password: hashpw,
        otp: mailer.otp,
        avatar: "",
        phone: "",
        fullname: "",
      })
      await newUser.save()
      useremail = to
      res.render("pages/otp",{
        layout: null,
        title: "Verify"
      })
    }
  } catch (error) {
    console.log(error)
    res.send(error)
  }
}
const otpAuth = async (req, res)=>{
  const{digit1, digit2, digit3, digit4, digit5, digit6} = req.body
  const userOtp = `${digit1}${digit2}${digit3}${digit4}${digit5}${digit6}`
  const user = UserModel.findOne({email: useremail})
  const Otp = user.otp
  userOtp.toLowerCase()
  if(userOtp === Otp){
    const ver = UserModel.updateOne({email: useremail}, {verified: true})
    res.redirect("/login")
  }else{
    const otpcount = user.otp_count++;
    if(otpcount === 3){
      await mailer.sendMail(useremail)
      UserModel.updateOne({email: useremail}, {otp: mailer.otp})
      UserModel.updateOne({email: useremail},{otp_count: 0})
    } else
      UserModel.updateOne({email: useremail},{otp_count: otpcount})
    res.render("pages/otp")
  }
}
module.exports = {
  sendMail,
  otpAuth
}