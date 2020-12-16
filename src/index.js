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
const cookieParser = require("cookie-parser");
const userRoute = require("./routes/user.route");
const webRoute = require("./routes/web.route");
const User = require("./models/User");

//PassportJS config
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

//PassportJS end config

// connect mongo
mongoClient
  .connect(process.env.MONGODB_URI, {
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

//use cookie to save
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

const adminRoute = require("./routes/admin.route");
const teacherRoute = require("./routes/teacher.route")

app.use("/admin", adminRoute);
app.use("/teacher", teacherRoute)
app.use("/user", userRoute);
app.use("/", webRoute);

app.listen(port, () => {
  console.log(`HWA listen att http://localhost:${port}`);
});
