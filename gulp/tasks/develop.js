(function() {
    'use strict';

    var gulp = require('gulp'),
        connect = require('gulp-connect');

    gulp.task('livereload-connect', ['minify-html'], function() {
        connect.server({
            root: './build',
            livereload: true
        });
    });

    gulp.task('livereload-html', function() {
        gulp.src('./build')
            .pipe(connect.reload());
    });

    gulp.task('livereload-watch', function() {
        gulp.watch(['./src/sass/**/*.scss'], ['minify-html', 'livereload-html']);
        gulp.watch(['./src/js/**/*.js'], ['minify-html', 'livereload-html']);
        gulp.watch(['./src/images/**/*.{gif,jpg,png}'], ['minify-html', 'livereload-html']);
        gulp.watch(['./src/content/**/*.md'], ['minify-html', 'livereload-html']);
    });

    gulp.task('develop', ['livereload-connect', 'livereload-watch']);
})();
