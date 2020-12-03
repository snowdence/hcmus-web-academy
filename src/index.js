require("dotenv").config();
const path = require("path");
const express = require("express");
const morgan = require("morgan");
const app = express();
const exphbs = require("express-handlebars");
const mongoClient = require("mongoose");
const bodyParser = require("body-parser");
// connect mongo
mongoClient
  .connect("mongodb://localhost:27017/hwa", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("[SUCCESS] Connected to mongoDB"))
  .catch(() => console.error("Error mongodb"));
//router
const userRoute = require("./routes/user");

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

app.get("/", (req, res) => {
  console.log(req.query);

  const data = {
    title: "Trang chủ",
    username: "admin",
    password: "admin",
  };
  res.render("pages/home", data);
});

app.listen(port, () => {
  console.log(`HWA listen att http://localhost:${port}`);
});
