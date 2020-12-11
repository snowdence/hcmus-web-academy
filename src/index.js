require("dotenv").config();
const path = require("path");
const express = require("express");
const morgan = require("morgan");
const app = express();
const exphbs = require("express-handlebars");
const mongoClient = require("mongoose");
const passport = require("passport");
const bodyParser = require("body-parser");
const localStrategy = require("passport-local").Strategy;
const session = require("express-session");
var flash = require("connect-flash");
const userInfoMiddleware = require("./middleware/user-info");

const User = require("./models/User");
passport.use(
  new localStrategy(async (username, password, done) => {
    const user = await User.findOne({ username: username });

    if (!user || !user.password || password != user.password) {
      return done(null, false, { error: "Sai email hoặc mật khẩu" });
    }
    return done(null, user);
  })
);

passport.serializeUser((user, done) => {
  done(null, user.username);
});

passport.deserializeUser(async (username, done) => {
  const user = await User.findOne({ username: username });
  if (!user) {
    return done(null, false);
  }

  return done(null, user.toObject());
});
const cookieParser = require("cookie-parser");

// connect mongo
mongoClient
  .connect("mongodb://localhost:27017/hwa", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("[SUCCESS] Connected to mongoDB"))
  .catch(() => console.error("Error mongodb"));
//router

//passport
app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: true }));
//use session to save
/*
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: "secret",
    cookie: {
      maxAge: 1000 * 60 * 10,
    },
  })
);
*/
const cookieSession = require("cookie-session");
app.use(
  cookieSession({
    name: "session",
    keys: ["screat"],

    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(userInfoMiddleware());
const userRoute = require("./routes/user");
const webRoute = require("./routes/web");
const { Passport } = require("passport");

// Config PORT, constant
const port = process.env.PORT || 3000;
const publicDirectory = path.join(__dirname, "public");
const viewDirectory = path.join(publicDirectory, "views");
// Config server use library middleware
//app.use(morgan("combined"));
app.use(express.static(publicDirectory));

app.use(bodyParser.json());

//Config hbs

//create engine name <hbs> with constructor exphbs({config option})
const supportHelper = require("./views/helpers/helper");
const user = require("./controllers/user");

app.engine(
  "hbs",
  exphbs({
    defaultLayout: "main",
    extname: ".hbs",
    helpers: supportHelper.helpers,

    // viewEngine: {
    //   extName: ".hbs",
    //   partialsDir: path.join(viewDirectory, "partials"),
    //   layoutsDir: path.join(viewDirectory, "layouts"),
    //   defaultLayout: "main.hbs",
    // },
    viewPath: viewDirectory,
  })
);

//set engine hbs as view engine
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

//config router
// add to
// app.use(function (req, res, next) {
//   var render = res.render;
//   res.render = function (view, locals, cb) {
//     if (typeof locals == "object") locals.user = req.user;
//     render.call(res, view, locals, cb);
//   };
//   next();
// });

app.use("/user", userRoute);
app.use("/custom", userRoute);
app.use("/", webRoute);

// app.get("/", (req, res) => {
//   console.log(req.query);

//   const data = {
//     title: "Trang chủ",
//     username: "admin",
//     password: "admin",
//   };
//   res.render("pages/home", data);
// });

app.listen(port, () => {
  console.log(`HWA listen att http://localhost:${port}`);
});
