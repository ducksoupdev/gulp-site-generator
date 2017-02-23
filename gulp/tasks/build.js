"use strict";

var gulp = require("gulp");

gulp.task("build", ["uncss", "concat-js", "image-min", "copy-assets", "minify-html"]);
