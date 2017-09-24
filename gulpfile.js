'use strict';

var del = require('del'),
    gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    umd = require('gulp-umd');

var umdNamespace = function() {
  return 'sentinel';
};


// ============================================================================
// PUBLIC TASKS
// ============================================================================

gulp.task('build-examples', gulp.series(
  clean('./examples/assets/sentineljs'),
  buildJs('./examples/assets/sentineljs')
));


gulp.task('build-dist', gulp.series(
  clean('./dist'),
  gulp.parallel(
    buildJs('./dist'),
    buildUmdJs('./dist')
  )
));


gulp.task('build-tests', gulp.series(
  clean('./test/assets/sentineljs'),
  buildJs('./test/assets/sentineljs')
));


gulp.task('build-all', gulp.parallel(
  'build-examples',
  'build-dist',
  'build-tests'
));



// ============================================================================
// PRIVATE TASKS
// ============================================================================

function makeTask(displayName, fn) {
  if (displayName) fn.displayName = displayName;
  return fn;
}


function clean(dirname) {
  return makeTask('clean: ' + dirname, function(done) {
    return del(dirname, done);
  });
}


function buildJs(dirname) {
  return makeTask('build-js: ' + dirname, function() {
    return gulp.src('src/sentinel.js')
      .pipe(umd({
        namespace: umdNamespace,
        template: 'umd-templates/web.js'
      }))
      .pipe(jshint())
      .pipe(jshint.reporter('default'))
      .pipe(rename('sentinel.js'))
      .pipe(gulp.dest(dirname))
      .pipe(uglify())
      .pipe(rename('sentinel.min.js'))
      .pipe(gulp.dest(dirname));
  });
}

function buildUmdJs(dirname) {
  return makeTask('build-umd-js: ' + dirname, function() {
    return gulp.src('src/sentinel.js')
      .pipe(umd({
        namespace: umdNamespace,
        template: 'umd-templates/UMD.js'
      }))
      .pipe(jshint())
      .pipe(jshint.reporter('default'))
      .pipe(rename('sentinel.umd.js'))
      .pipe(gulp.dest(dirname));
  });
}
