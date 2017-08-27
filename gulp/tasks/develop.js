var gulp = require("gulp"),
    browserSync = require("browser-sync");

gulp.task("bs-reload", function () {
    browserSync.reload();
});

gulp.task("browser-sync", function () {
    browserSync.init(["css/*.css", "js/*.js"], {
        server: {
            baseDir: "./"
        }
    });
});

gulp.task("serve", function () {
    browserSync.init({
        server: {
            baseDir: "./build"
        }
    });
});

gulp.task("watch", function () {
    gulp.watch(["./src/sass/**/*.scss"], ["sass"]);
    gulp.watch(["./src/templates/**/*.hbs"], ["minify-html"]);
    gulp.watch(["./src/js/**/*.js"], ["concat-js"]);
    gulp.watch(["./src/images/**/*.{gif,jpg,png}"], ["image-min"]);
    gulp.watch(["./src/content/**/*.md"], ["minify-html"]);
    gulp.watch(["./build/**/*.*"], ["bs-reload"]);
});

gulp.task("develop", ["watch", "serve"]);
