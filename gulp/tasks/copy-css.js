(function () {
    'use strict';

    var gulp = require('gulp');

    gulp.task('copy-css', function() {
        return gulp.src('./src/css/**/!(style).css')
            .pipe(gulp.dest('./build/css'));
    });
})();
