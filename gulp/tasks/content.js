"use strict";

var gulp = require("gulp"),
    markdownToJson = require("gulp-markdown-to-json"),
    marked = require("marked"),
    replace = require("gulp-replace");

gulp.task("content", ["copy-assets"], function () {
    return gulp.src("./src/content/**/*.md")
        .pipe(replace(/(^(?!---\n).)/, "---\n$1"))
        .pipe(markdownToJson(marked))
        .pipe(gulp.dest("./build/content"));
});
