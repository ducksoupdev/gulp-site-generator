"use strict";

var gulp = require("gulp"),
    minifyHTML = require("gulp-minify-html");

gulp.task("minify-html", ["uncss"], function () {
    return gulp.src("./build/**/*.html")
        .pipe(minifyHTML({
            comments: true,
            spare: true
        }))
        .pipe(gulp.dest("./build"));
});
