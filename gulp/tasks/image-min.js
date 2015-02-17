(function () {
    'use strict';

    var gulp = require('gulp'),
        jpegoptim = require('imagemin-jpegoptim'),
        pngquant = require('imagemin-pngquant'),
        optipng = require('imagemin-optipng');

    gulp.task('image-min', function () {
        return gulp.src('./src/images/**/*.{png,jpg,jpeg,gif,svg}')
            .pipe(optipng({optimizationLevel: 3})())
            .pipe(pngquant({quality: '65-80', speed: 4})())
            .pipe(jpegoptim({max: 70})())
            .pipe(gulp.dest('./build/images'));
    });
})();
