"use strict";

var gulp = require("gulp"),
    removeDir = require("../lib/remove-dir");

gulp.task("clobber", function () {
    return removeDir("./build");
});
