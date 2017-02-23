"use strict";

var gulp = require("gulp"),
    open = require("gulp-open"),
    connect = require("gulp-connect");

gulp.task("server", function () {
    connect.server({
        root: "build"
    });
    gulp.src(__filename).pipe(open({uri: "http://localhost:8080"}));
});
