const nodeMailer = require('nodemailer')
const adminEmail = 'hcmusclck18@gmail.com'
const adminPassword = 'taokhongbiet'
const mailHost = 'smtp.gmail.com'
const mailPort = 587
const sendMail = (receiver) => {
  const transporter = nodeMailer.createTransport({
    host: mailHost,
    port: mailPort,
    secure: false, // nếu các bạn dùng port 465 (smtps) thì để true, còn lại hãy để false cho tất cả các port khác
    auth: {
      user: adminEmail,
      pass: adminPassword
    }
  })
  const options = {
    from: adminEmail, 
    to: receiver,
    text: "hello"
  }
  return transporter.sendMail(options)
}
module.exports = {
  sendMail
}