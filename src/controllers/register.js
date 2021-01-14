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
        title: "Verify",
        noti: "Enter the code we've just sent to your email"
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
  const user = await UserModel.findOne({email: useremail})
  const Otp = user.otp
  userOtp.toLowerCase()
  if(userOtp === Otp){
    await UserModel.updateOne({email: useremail}, {verified: true})
    res.redirect("/login")
  }else{
    const otpcount = user.otp_count + 1;
    if(otpcount === 3){
      await mailer.sendMail(useremail)
      await UserModel.updateOne({email: useremail}, {otp: mailer.otp})
      await UserModel.updateOne({email: useremail},{otp_count: 0})
      res.render("pages/otp", {
        layout: null,
        title: "Verify",
        noti: "You entered your OTP incorrectly 3 times. We've just resent the code to your email"
      })
    } else {
      await UserModel.updateOne({email: useremail},{otp_count: otpcount})
      res.render("pages/otp", {
        layout: null,
        title: "Verify",
        noti: "Wrong OTP! Please enter again"
      })
    }
  }
}
module.exports = {
  sendMail,
  otpAuth
}