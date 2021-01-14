const nodeMailer = require('nodemailer')
const otpGenerator = require('otp-generator')
const adminEmail = 'hcmusclck18@gmail.com'
const adminPassword = 'taokhongbiet'
const mailHost = 'smtp.gmail.com'
const mailPort = 587

const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
const otptxt = otp.toUpperCase()
const txt = `Your verify code: ${otptxt}`

const sendMail = (receiver) => {
  const transporter = nodeMailer.createTransport({
    host: mailHost,
    port: mailPort,
    secure: false, 
    auth: {
      user: adminEmail,
      pass: adminPassword,
    }
  })
  const options = {
    from: adminEmail, 
    to: receiver,
    subject: "Verify your email",
    text: txt
  }
  return transporter.sendMail(options)
}
module.exports = {
  sendMail,
  otp
}