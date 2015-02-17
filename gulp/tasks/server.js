(function () {
    'use strict';

    var gulp = require('gulp'),
        connect = require('gulp-connect');

    gulp.task('server', function() {
        connect.server({
            root: 'build'
        });
    });
})();
