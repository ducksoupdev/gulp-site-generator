const gulp = require('gulp');
const browserSync = require('browser-sync');
const reload = browserSync.reload;

/* Reload task */
gulp.task('bs-reload', () => {
  browserSync.reload();
});

/* Prepare Browser-sync for localhost */
gulp.task('browser-sync', () => {
  browserSync.init(['css/*.css', 'js/*.js'], {
    server: {
      baseDir: './'
    }      
  });
});

gulp.task('serve', () => {
  browserSync.init({
    server: {
      baseDir: './build'
    }
  });
});


gulp.task('watch', () => {
    gulp.watch(["./src/sass/**/*.scss"], ["sass"]);
    gulp.watch(["./src/templates/**/*.hbs"], ["minify-html"]);
    gulp.watch(["./src/js/**/*.js"], ["concat-js"]);
    gulp.watch(["./src/images/**/*.{gif,jpg,png}"], ["image-min"]);
    gulp.watch(["./src/content/**/*.md"], ["minify-html"]);
    gulp.watch(["./build/**/*.*"], ["bs-reload"]);
})

gulp.task("develop", ["watch", "serve"]);
