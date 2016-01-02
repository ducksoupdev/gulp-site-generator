"use strict";

var gulp = require("gulp"),
    imageminMozjpeg = require("imagemin-mozjpeg"),
    pngquant = require("imagemin-pngquant"),
    optipng = require("imagemin-optipng"),
    fs = require("fs");

gulp.task("image-min", function () {
    var siteData = JSON.parse(fs.readFileSync("./site.json", "utf8"));
    if (siteData.hasOwnProperty("imageCompression") && !siteData.imageCompression) {
        return gulp.src("./src/images/**/*.{png,jpg,jpeg,gif,svg}")
            .pipe(gulp.dest("./build/images"));
    } else {
        return gulp.src("./src/images/**/*.{png,jpg,jpeg,gif,svg}")
            .pipe(optipng({ optimizationLevel: 3 })())
            .pipe(pngquant({ quality: "65-80", speed: 4 })())
            .pipe(imageminMozjpeg({ quality: 70 })())
            .pipe(gulp.dest("./build/images"));
    }
});
