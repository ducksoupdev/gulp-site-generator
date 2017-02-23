"use strict";

var gulp = require("gulp");

gulp.task("copy-assets", ["copy-fonts"], function () {
    return gulp.src(["./src/favicon.ico", "./src/*.png"])
        .pipe(gulp.dest("./build"));
});
