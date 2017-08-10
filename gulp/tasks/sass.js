"use strict";

var gulp = require("gulp"),
    sass = require("gulp-sass"),
    minifyCSS = require("gulp-minify-css"),
    rename = require("gulp-rename");

gulp.task("sass", function () {
    return gulp.src("./src/sass/**/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("./src/css"))
        .pipe(minifyCSS())
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(gulp.dest("./build/css"));
});
