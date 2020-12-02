require("dotenv").config();
const path = require("path");
const express = require("express");
const morgan = require("morgan");
const app = express();
const exphbs = require("express-handlebars");

// Config PORT, constant
const port = process.env.PORT || 3000;
const publicDirectory = path.join(__dirname, "public");

// Config server use library middleware
app.use(morgan("combined"));
app.use(express.static(publicDirectory));

//Config hbs

//create engine name <hbs> with constructor exphbs({config option})
app.engine(
  "hbs",
  exphbs({
    defaultLayout: "main",
    extname: ".hbs",
  })
);

//set engine hbs as view engine
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("pages/home");
});

app.listen(port, () => {
  console.log(`HWA listen att http://localhost:${port}`);
});
