"use strict";

var gulp = require("gulp"),
    glob = require("glob"),
    uncss = require("gulp-uncss"),
    minifyCSS = require("gulp-minify-css"),
    rename = require("gulp-rename");

gulp.task("uncss", ["compile"], function () {
    return gulp.src("./src/css/style.css")
        .pipe(uncss({
            html: glob.sync("./build/**/*.html")
        }))
        .pipe(minifyCSS())
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(gulp.dest("./build/css"));
});
