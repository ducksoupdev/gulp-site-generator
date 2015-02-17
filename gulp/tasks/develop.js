(function () {
    'use strict';

    var gulp = require('gulp'),
        connect = require('gulp-connect');

    gulp.task('livereload-connect', function() {
        connect.server({
            root: 'build',
            livereload: true
        });
    });

    gulp.task('livereload-html', function () {
        gulp.src('./build/**/*.html')
            .pipe(connect.reload());
    });

    gulp.task('livereload-watch', function () {
        gulp.watch(['./src/!(libs)/**/*'], ['minify-html']);
    });

    gulp.task('develop', ['livereload-connect', 'livereload-watch']);
})();
