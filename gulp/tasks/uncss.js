"use strict";

var gulp = require("gulp"),
    glob = require("glob"),
    uncss = require("gulp-uncss"),
    minifyCSS = require("gulp-minify-css"),
    rename = require("gulp-rename"),
    fs = require("fs");

gulp.task("uncss", ["compile"], function () {
    var siteData = JSON.parse(fs.readFileSync("./site.json", "utf8"));
    var uncssIgnore;
    if (siteData.uncssIgnore) {
        uncssIgnore = siteData.uncssIgnore;
    }
    return gulp.src("./src/css/style.css")
        .pipe(uncss({
            html: glob.sync("./build/**/*.html"),
            ignore: uncssIgnore
        }))
        .pipe(minifyCSS())
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(gulp.dest("./build/css"));
});
