"use strict";

var gulp = require("gulp"),
    runSequence = require("run-sequence");

gulp.task("default", function(done) {
    process.env.GSD_PUBLISHED = "true";
    runSequence("build", done);
});
