"use strict";

var gulp = require("gulp"),
    minifyHTML = require("gulp-minify-html");

gulp.task("minify-html", ["compile"], function () {
    return gulp.src("./build/**/*.html")
        .pipe(minifyHTML({
            comments: false,
            spare: true
        }))
        .pipe(gulp.dest("./build"));
});
