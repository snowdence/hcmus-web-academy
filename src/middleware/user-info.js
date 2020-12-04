const userInfoMiddleware = () => {
  return (req, res, next) => {
    //console.log(`User info middleware" + ${JSON.stringify(req.user)} `);
    if (typeof res.locals.user === "undefined") {
      //console.log("set ");
      res.locals.user = req.user;
    }
    //res.locals.user = req.user;
    next();
  };
};
module.exports = userInfoMiddleware;
