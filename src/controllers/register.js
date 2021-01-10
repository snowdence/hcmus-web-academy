const mailer = require('../utils/mailer')
let sendMail = async (req, res) => {
  try {
    const to = req.body.to
    await mailer.sendMail(to)
    res.render("pages/registry", {
      layout: null
    })
  } catch (error) {
    console.log(error)
    res.send(error)
  }
}
module.exports = {
  sendMail
}