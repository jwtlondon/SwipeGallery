var gulp = require('gulp');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");


gulp.task('scripts', function() {
  // Minify and copy all JavaScript (except bower folder)
  return gulp.src('src/js/*.js', {ignore: ['third_party']})
    .pipe(uglify())
    .pipe(rename("swipeGallery.min.js"))
    .pipe(gulp.dest('dist/js'));
});


gulp.task('default', ['scripts']);