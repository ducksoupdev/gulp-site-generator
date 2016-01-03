"use strict";

var gulp = require("gulp");

gulp.task("test-ci", ["test"], function () {
    var coveralls = require("gulp-coveralls");
    return gulp.src("./coverage/**/lcov.info")
        .pipe(coveralls());
});
