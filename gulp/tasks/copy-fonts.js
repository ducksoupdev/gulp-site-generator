"use strict";

var gulp = require("gulp");

gulp.task("copy-fonts", function () {
    return gulp.src(["src/fonts/**/*"])
        .pipe(gulp.dest("./build/fonts"));
});
