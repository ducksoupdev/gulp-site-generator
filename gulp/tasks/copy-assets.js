(function () {
    'use strict';

    var gulp = require('gulp');

    gulp.task('copy-assets', ['sass', 'copy-fonts', 'copy-css', 'concat-js', 'image-min'], function() {
        return gulp.src(['./src/favicon.ico', './src/*.png'])
            .pipe(gulp.dest('./build'));
    });
})();
