"use strict";

var gulp = require("gulp"),
    connect = require("gulp-connect");

gulp.task("livereload-connect", ["build"], function () {
    connect.server({
        root: "./build",
        livereload: true
    });
});

gulp.task("livereload-html", function () {
    gulp.src("./build")
        .pipe(connect.reload());
});

gulp.task("livereload-watch", function () {
    gulp.watch(["./src/sass/**/*.scss"], ["build", "livereload-html"]);
    gulp.watch(["./src/js/**/*.js"], ["build", "livereload-html"]);
    gulp.watch(["./src/images/**/*.{gif,jpg,png}"], ["build", "livereload-html"]);
    gulp.watch(["./src/content/**/*.md"], ["build", "livereload-html"]);
});

gulp.task("develop", ["livereload-connect", "livereload-watch"]);
