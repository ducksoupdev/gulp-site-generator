(function () {
    'use strict';

    var gulp = require('gulp'),
        markdown = require('gulp-markdown-to-json'),
        replace = require('gulp-replace');

    gulp.task('content', ['copy-assets'], function() {
        return gulp.src('./src/content/**/*.md')
            .pipe(replace(/(^(?!---\n).)/, "---\n$1"))
            .pipe(markdown())
            .pipe(gulp.dest('./build/content'));
    });
})();
