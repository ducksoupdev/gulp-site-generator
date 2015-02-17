(function () {
    'use strict';

    var gulp = require('gulp'),
        concat = require('gulp-concat'),
        uglify = require('gulp-uglify'),
        rename = require('gulp-rename');

    gulp.task('concat-js', function() {
        return gulp.src([
            './src/libs/masonry/dist/masonry.pkgd.js',
            './src/libs/imagesloaded/imagesloaded.pkgd.js',
            './src/libs/atomic/dist/atomic.js',
            './src/js/script.js'])
            .pipe(concat('combined.js'))
            .pipe(uglify())
            .pipe(rename({
                suffix: '.min'
            }))
            .pipe(gulp.dest('./build/js'));
    });
})();
