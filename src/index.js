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
// connect mongo
mongoClient
  .connect("mongodb://localhost:27017/hwa", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("[SUCCESS] Connected to mongoDB"))
  .catch(() => console.error("Error mongodb"));
//router

//passport
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "secret",
    cookie: {
      maxAge: 1000 * 60 * 10,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

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
app.engine(
  "hbs",
  exphbs({
    defaultLayout: "main",
    extname: ".hbs",
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

app.use("/user", userRoute);
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

passport.use(
  new localStrategy((username, password, done) => {
    if (username == "admin" && password == "admin") {
      return done(null, { username, password });
    } else {
      return done(null, false);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.username);
});

passport.deserializeUser((username, done) => {
  return done(null, { username });
});
