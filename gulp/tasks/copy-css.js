(function () {
    'use strict';

    var gulp = require('gulp');

    gulp.task('copy-css', function() {
        return gulp.src('./src/css/ie.css')
            .pipe(gulp.dest('./build/css'));
    });
})();
