const authenticationMiddleware = () => {
  return (req, res, next) => {
    console.log(`session passport" + ${JSON.stringify(req.session.passport)} `);
    if (req.isAuthenticated()) return next();

    res.redirect("/login");
  };
};
module.exports = authenticationMiddleware;
