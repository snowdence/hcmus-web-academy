require("dotenv").config();
var gulp = require("gulp");
var browserSync = require("browser-sync");
var reload = browserSync.reload;
var nodemon = require("gulp-nodemon");

var proxy_port = process.env.PORT || 3000;
/*
 * Gulp Tasks
 */

gulp.task("browser-sync", function () {
  browserSync({
    proxy: "localhost:3000", // local node app address
    port: 5000, // use *different* port than above
    notify: true,
  });
});

gulp.task("nodemon", function (cb) {
  var called = false;
  return nodemon({
    script: "./src/index.js",
    ignore: ["gulpfile.js", "node_modules/"],
  })
    .on("start", function () {
      if (!called) {
        called = true;
        cb();
      }
    })
    .on("restart", function () {
      setTimeout(function () {
        reload({ stream: false });
      }, 500);
    });
});

gulp.task(
  "default",
  gulp.parallel([
    "browser-sync",
    "nodemon",
    function () {
      gulp.watch(["./src/**/*"], reload);
    },
  ])
);
