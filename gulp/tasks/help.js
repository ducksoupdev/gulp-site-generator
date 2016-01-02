"use strict";

var gulp = require("gulp");

gulp.task("help", function () {
    console.log("Static site generator using Gulp\n\n");
    console.log("Tasks available:\n");
    console.log("* default\n");
    console.log("* develop\n");
    console.log("* clobber\n");
    console.log("* image-min\n");
    console.log("* sass\n");
    console.log("* server\n");
    console.log("* help\n");
});
