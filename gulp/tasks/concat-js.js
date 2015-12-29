"use strict";

var gulp = require("gulp"),
    concat = require("gulp-concat"),
    uglify = require("gulp-uglify"),
    rename = require("gulp-rename"),
    fs = require("fs");

gulp.task("concat-js", function () {
    var siteData = JSON.parse(fs.readFileSync("./site.json", "utf8"));
    var jsFiles = ["./src/js/*.js"];
    if (siteData.concatJs) {
        jsFiles = siteData.concatJs;
    }
    return gulp.src(jsFiles)
        .pipe(concat("combined.js"))
        .pipe(uglify())
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(gulp.dest("./build/js"));
});
