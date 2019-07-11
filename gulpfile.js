const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
sass.compiler = require('node-sass');

function browserSyncServer(cb) {
  browserSync.init({
    proxy: 'dev.dev',
    port: '4000',
  });
  cb();
}

function sassComp(cb) {
  return gulp.src('./assets/stylesheets/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./assets/stylesheets'));
  cb();
}

function sassWatch(cb) {
  gulp.watch('./assets/stylesheets/*.scss', gulp.series(sassComp));
  cb();
}

gulp.task('default', gulp.series(sassWatch, sassComp));
