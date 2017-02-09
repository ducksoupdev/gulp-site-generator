"use strict";

var gulp = require("gulp");

gulp.task("test", function (done) {
    var mocha = require("gulp-mocha"),
        istanbul = require("gulp-istanbul");

    gulp.src(["./gulp/lib/*.js", "./install/lib/*.js"])
        .pipe(istanbul())
        .pipe(istanbul.hookRequire())
        .on("finish", function () {
            gulp.src(["./gulp/tests/*.spec.js", "./install/tests/*.spec.js"])
                .pipe(mocha())
                .pipe(istanbul.writeReports())
                .on("end", done);
        });
});
