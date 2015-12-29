"use strict";

var gulp = require("gulp"),
    mocha = require("gulp-mocha"),
    istanbul = require("gulp-istanbul");

gulp.task("test", function (done) {
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
