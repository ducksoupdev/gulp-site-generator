"use strict";

var gulp = require("gulp"),
    coveralls = require("gulp-coveralls");

gulp.task("test-ci", ["test"], function () {
    return gulp.src("./coverage/**/lcov.info")
        .pipe(coveralls());
});
