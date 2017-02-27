"use strict";

var gulp = require("gulp"),
    editor = require("../lib/editor");

gulp.task("editor", function() {
    editor.start();
});