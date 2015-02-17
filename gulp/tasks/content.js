(function () {
    'use strict';

    var gulp = require('gulp'),
        markdown = require('gulp-markdown-to-json');

    gulp.task('content', ['copy-assets'], function() {
        return gulp.src('./src/content/**/*.md')
            .pipe(markdown())
            .pipe(gulp.dest('./build/content'));
    });
})();
