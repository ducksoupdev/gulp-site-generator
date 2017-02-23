"use strict";

var gulp = require("gulp"),
    markdownToJson = require("gulp-markdown-to-json"),
    marked = require("marked");

gulp.task("content", function () {
    return gulp.src("./src/content/**/*.md")
        .pipe(markdownToJson(marked))
        .pipe(gulp.dest("./build/content"));
});
