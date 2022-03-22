const source = require('vinyl-source-stream');
const streamify = require('gulp-streamify');
const browserify = require('browserify');
const browserifyShader = require('browserify-shader');
const uglify = require('gulp-uglify');
const gulp = require('gulp');
const browserSync = require('browser-sync').create();

gulp.task('connect', () => {
  browserSync.init({
    watch: true,
    port: 8000,
    server: './dist'
  });
});

gulp.task("build", () => {
  return browserify({
    entries: "./js/main.js",
    extensions: [".js"],
    transform: browserifyShader
  })
    .bundle()
    .pipe(source("all.js"))
    .pipe(streamify(uglify()))
    .pipe(gulp.dest("dist/"));
});

gulp.task('watch', () => {
  gulp.watch('./js/*.js', gulp.series('build'));
  gulp.watch('app/*.css').on('change', browserSync.reload);
  gulp.watch('app/*.html').on('change', browserSync.reload);
});

gulp.task('default', gulp.series('build', gulp.parallel('connect', 'watch')));
