const authenticationMiddleware = () => {
  return (req, res, next) => {
    console.log(`session passport" + ${JSON.stringify(req.session.passport)} `);
    if (req.isAuthenticated()) return next();

    res.redirect("/login");
  };
};
const adminMiddleware = () => {
  return (req, res, next) => {
    console.log(`session passport" + ${JSON.stringify(req.session.passport.user)} `);
    const { role } = req.session.passport.user;
    console.log("Role is: ");

    if (req.isAuthenticated() && role && role == 0) {
      return next();
    }
    res.redirect("/");
  };
};

const teacherMiddleware = () => {
  return (req, res, next) => {
    console.log(`session passport" + ${JSON.stringify(req.session.passport.user)} `);
    const { role } = req.session.passport.user;
    console.log("Role is: ");

    if (req.isAuthenticated() && role && role <= 1) {
      return next();
    }
    res.redirect("/");
  };
};
module.exports = { authenticationMiddleware, adminMiddleware, teacherMiddleware };
